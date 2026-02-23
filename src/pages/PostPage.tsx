import React, { useMemo, useEffect, useState } from 'react';
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

// Initialize mermaid with htmlLabels enabled
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit'
});

const MermaidDiagram = ({ definition }: { definition: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      try {
        // ID must start with a letter and be alphanumeric
        const id = `mermaid-graph-${Math.random().toString(36).substring(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, definition);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (e) {
        console.error('Mermaid render error:', e);
        if (isMounted) setError(true);
      }
    };
    if (definition) render();
    return () => { isMounted = false; };
  }, [definition]);

  if (error) {
    return (
      <div className="mermaid-error" style={{ border: '1px solid #ffcfcf', padding: '1.5rem', background: '#fff5f5', color: '#c00', borderRadius: '4px', margin: '1rem 0' }}>
        <strong style={{ display: 'block', marginBottom: '1rem', color: '#800' }}>Mermaid Syntax Error</strong>
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>The diagram definition could not be parsed. Please check the syntax.</p>
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85em', background: 'rgba(0,0,0,0.03)', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)' }}>
          {definition}
        </div>
      </div>
    );
  }
  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
};

const unescapeHtml = (text: string) => {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
};

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, loading } = usePosts();

  const post = useMemo(() => {
    if (loading) return null;
    return posts.find(p => p.slug === slug);
  }, [posts, loading, slug]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!post) {
    return <div className="error-container">Post not found.</div>;
  }

  return (
    <article className="post-full">
      <header className="post-full-header">
        <h1 className="post-full-title">{post.title}</h1>
        <div className="post-full-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span className="post-full-category">{post.category}</span>
        </div>
      </header>

      <div className="post-full-content">
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const isMermaid = match && match[1] === 'mermaid';

              // Improved children handling: join if array, ensure string
              const content = Array.isArray(children)
                ? children.map(child => typeof child === 'string' ? child : '').join('')
                : String(children);

              const rawContent = content
                .replace(/\r\n/g, '\n')
                .replace(/\n$/, '');

              if (!inline && isMermaid) {
                const unescapedDefinition = unescapeHtml(rawContent);
                return <MermaidDiagram definition={unescapedDefinition} />;
              }

              return !inline && match ? (
                <SyntaxHighlighter
                  children={rawContent}
                  style={vscDarkPlus as any as SyntaxHighlighterStyle}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
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
