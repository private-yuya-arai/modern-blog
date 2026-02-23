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

mermaid.initialize({ startOnLoad: false, theme: 'default' });

const MermaidDiagram = ({ definition }: { definition: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const render = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, definition);
        setSvg(svg);
        setError(false);
      } catch (e) {
        console.error('Mermaid render error:', e);
        setError(true);
      }
    };
    if (definition) render();
  }, [definition]);

  if (error) {
    return (
      <div className="mermaid-error" style={{ border: '1px solid red', padding: '1rem', background: '#ffe6e6', color: '#c00' }}>
        <strong>Mermaid Syntax Error</strong>
        <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85em' }}>
          {definition}
        </div>
        <details style={{ marginTop: '1rem' }}>
          <summary>Debug Info (JSON)</summary>
          <pre style={{ fontSize: '0.75em', marginTop: '0.5rem' }}>
            {JSON.stringify(definition)}
          </pre>
        </details>
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
    return <div>Loading post...</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
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

              // Join children accurately to avoid unintended commas or spacing
              const rawContent = (Array.isArray(children) ? children.join('') : String(children))
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
              // Ensure src is normalized
              return <img src={normalizePath(src)} alt={alt} {...props} />;
            }
          }}
        />
      </div>
    </article>
  );
};

export default PostPage;
