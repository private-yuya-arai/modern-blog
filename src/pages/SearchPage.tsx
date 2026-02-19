import React, { useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom'; // useLocationをインポート
import usePosts from '../hooks/usePosts';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import Fuse from 'fuse.js';
import './HomePage.css';

const POSTS_PER_PAGE = 5;

const SearchPage: React.FC = () => {
  const { posts, loading } = usePosts();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const location = useLocation(); // useLocationを呼び出し

  const category = searchParams.get('category');
  const tags = searchParams.getAll('tag');
  const searchQuery = searchParams.get('q');

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ['title', 'content', 'excerpt', 'category', 'tags'],
      includeScore: true,
      threshold: 0.3,
    });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (loading) return [];

    let results = posts;

    if (searchQuery) {
      const searchResultSlugs = fuse.search(searchQuery).map(result => result.item.slug);
      results = results.filter(post => searchResultSlugs.includes(post.slug));
    }

    if (category) {
      results = results.filter(post => post.category === category);
    }

    if (tags.length > 0) {
      results = results.filter(post => tags.every(tag => post.tags.includes(tag)));
    }

    return results;
  }, [posts, loading, searchQuery, category, tags, fuse]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const generateTitle = () => {
    let title = 'すべての記事';
    if (searchQuery) {
      title = `検索結果: "${searchQuery}"`;
    }
    if (category) {
      title = `${title === 'すべての記事' ? '' : title + ' の '}カテゴリ: ${category}`;
    }
    if (tags.length > 0) {
      title = `${title === 'すべての記事' ? '' : title + ' の '}タグ: ${tags.join(', ')}`;
    }
    return title;
  };

  return (
    <div className="home-page-layout">
      <div className="main-column">
        <h1>{generateTitle()}</h1>
        <div className="post-list">
          {currentPosts.length > 0 ? (
            currentPosts.map(post => (
              <article key={post.slug} className="post-list-item">
                <header>
                  <h2 className="post-title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="post-meta">
                    <time dateTime={post.date}>{post.date}</time>
                    <span className="post-category">{post.category}</span>
                  </div>
                </header>
                <p className="post-excerpt">{post.excerpt}</p>
                <Link to={`/post/${post.slug}`} className="read-more">
                  続きを読む
                </Link>
              </article>
            ))
          ) : (
            <p>該当する記事はありません。</p>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={location.pathname + location.search} />
      </div>
      <Sidebar />
    </div>
  );
};

export default SearchPage;