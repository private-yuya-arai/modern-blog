import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import usePosts from '../hooks/usePosts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { normalizePath } from '../lib/posts';

import './PostPage.css';

import type { CSSProperties } from 'react';

type SyntaxHighlighterStyle = { [key: string]: CSSProperties };

// Initialize mermaid with permissive settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  logLevel: 'error'
});

const MermaidDiagram = ({ definition }: { definition: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!definition) return;
      try {
        const id = `mermaid-v11-${Math.random().toString(36).substring(2, 11)}`;
        // Mermaid v11 render is async and returns { svg, bindFunctions }
        const { svg: renderedSvg } = await mermaid.render(id, definition);
        if (isMounted) {
          setSvg(renderedSvg);
          setError('');
        }
      } catch (err: any) {
        console.error('Mermaid Render Error:', err);
        if (isMounted) {
          setError(err.message || 'Syntax Error');
        }
      }
    };

    renderDiagram();
    return () => { isMounted = false; };
  }, [definition]);

  if (error) {
    return (
      <div className="mermaid-error-box">
        <h4>Mermaid Syntax Error</h4>
        <p className="error-msg">{error}</p>
        <pre className="error-definition">{definition}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram-container"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// Robust helper to extract text from React children
const getRawText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getRawText).join('');
  if (children?.props?.children) return getRawText(children.props.children);
  return '';
};

// Recursive unescape to handle multi-encoded entities
const robustUnescape = (text: string): string => {
  let prevText;
  let currentText = text;
  const entities: { [key: string]: string } = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&amp;': '&',
    '&nbsp;': ' '
  };

  do {
    prevText = currentText;
    for (const [entity, char] of Object.entries(entities)) {
      currentText = currentText.replace(new RegExp(entity, 'g'), char);
    }
  } while (currentText !== prevText);

  return currentText;
};

import { useAI } from '../AIContext';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, loading } = usePosts();
  const { setCurrentPost, highlightedSection, setHighlightedSection } = useAI();

  const post = useMemo(() => {
    if (loading) return null;
    return posts.find(p => p.slug === slug);
  }, [posts, loading, slug]);

  useEffect(() => {
    setCurrentPost(post || null);
    // 元に戻すためのタイマー
    if (highlightedSection) {
      const timer = setTimeout(() => setHighlightedSection(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [post, setCurrentPost, highlightedSection, setHighlightedSection]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!post) {
    return <div className="error-container">Post not found.</div>;
  }

  return (
    <article className="post-full">
      <header className={`post-full-header ${highlightedSection === 'header' ? 'ai-highlight' : ''}`}>
        {post.image && (
          <div className="post-full-image-wrapper">
            <img src={post.image} alt={post.title} className="post-full-image" />
          </div>
        )}
        <div className="post-header-content">
          <span className="post-full-category">{post.category}</span>
          <h1 className="post-full-title">{post.title}</h1>
          <div className="post-full-meta">
            <time dateTime={post.date}>{post.date}</time>
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`post-full-content ${highlightedSection === 'content' ? 'ai-highlight' : ''}`}>
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const isMermaid = match && match[1] === 'mermaid';

              const rawContent = getRawText(children)
                .replace(/\r\n/g, '\n')
                .replace(/\n$/, '');

              if (!inline && isMermaid) {
                const unescapedDefinition = robustUnescape(rawContent);
                return <MermaidDiagram definition={unescapedDefinition} />;
              }

              return !inline && match ? (
                <div className={highlightedSection === 'code' ? 'ai-highlight-code' : ''}>
                  <SyntaxHighlighter
                    children={rawContent}
                    style={vscDarkPlus as any as SyntaxHighlighterStyle}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img({ src, alt, ...props }: any) {
              return <img src={normalizePath(src)} alt={alt} {...props} />;
            }
          }}
        />
      </div>
    </article>
  );
};

export default PostPage;
