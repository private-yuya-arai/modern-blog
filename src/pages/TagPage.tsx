import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import usePosts from '../hooks/usePosts';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import './HomePage.css'; // ホームページと同じスタイルを再利用

const POSTS_PER_PAGE = 5;

const TagPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const { posts, loading } = usePosts();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const decodedTagName = useMemo(() => tagName ? decodeURIComponent(tagName) : '', [tagName]);

  const filteredPosts = useMemo(() => {
    if (loading) return [];
    return posts.filter(post => post.tags.includes(decodedTagName));
  }, [posts, loading, decodedTagName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="home-page-layout">
      <div className="main-column">
        <h1>タグ: {decodedTagName}</h1>
        <div className="post-grid">
          {currentPosts.length > 0 ? (
            currentPosts.map(post => (
              <article key={post.slug} className="post-card">
                <Link to={`/post/${post.slug}`} className="post-card-link">
                  <div className="post-card-image-wrapper">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="post-card-image" />
                    ) : (
                      <div className="post-card-placeholder" />
                    )}
                  </div>
                  <div className="post-card-content">
                    <span className="post-card-category">{post.category}</span>
                    <h2 className="post-card-title">{post.title}</h2>
                    <time dateTime={post.date} className="post-card-date">{post.date}</time>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p>このタグの記事はありません。</p>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/tag/${tagName}`} />
      </div>
      <Sidebar />
    </div>
  );
};

export default TagPage;
