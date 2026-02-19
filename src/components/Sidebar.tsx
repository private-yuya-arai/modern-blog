import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePosts from '../hooks/usePosts';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { posts, loading } = usePosts();
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category');
  const selectedTags = searchParams.getAll('tag');

  // カテゴリリストの生成ロジック (変更なし)
  const categories = useMemo(() => {
    if (loading) return [];
    const categoryMap = new Map<string, number>();
    posts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts, loading]);

  // タグクラウドの生成ロジック (変更なし)
  const tags = useMemo(() => {
    if (loading) return [];
    const tagMap = new Map<string, number>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts, loading]);

  // 最新記事の生成ロジック (変更なし)
  const recentPosts = useMemo(() => {
    if (loading) return [];
    return posts.slice(0, 5);
  }, [posts, loading]);

  // カテゴリリンクのURLを生成するヘルパー関数
  const getCategoryLink = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === category) {
      // 既に選択されている場合はホームに戻る (フィルター解除)
      return '/';
    }
    // 他のカテゴリを選択
    newParams.set('category', category);
    // カテゴリを変更したらタグの選択はリセットする
    newParams.delete('tag');
    return `/search?${newParams.toString()}`;
  };

  // タグリンクのURLを生成するヘルパー関数
  const getTagLink = (tag: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentTags = newParams.getAll('tag');
    if (currentTags.includes(tag)) {
      // 既に選択されている場合はそのタグを削除 (フィルター解除)
      const updatedTags = currentTags.filter(t => t !== tag);
      newParams.delete('tag');
      updatedTags.forEach(t => newParams.append('tag', t));
    } else {
      // 新しく選択された場合はそのタグを追加
      newParams.append('tag', tag);
    }
    return `/search?${newParams.toString()}`;
  };

  if (loading) {
    return <aside className="sidebar">Loading sidebar...</aside>;
  }

  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <h3>カテゴリ</h3>
        <ul className="category-list">
          {categories.map(([category, count]) => (
            <li key={category}>
              <Link
                to={getCategoryLink(category)}
                className={selectedCategory === category ? 'active' : ''}
              >
                {category} ({count})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-section">
        <h3>タグ</h3>
        <div className="tag-cloud">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              to={getTagLink(tag)}
              className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              {tag} ({count})
            </Link>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3>最新記事</h3>
        <ul className="recent-posts-list">
          {recentPosts.map(post => (
            <li key={post.slug}>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;