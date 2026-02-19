import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      // クエリが空の場合は検索条件をクリアしてホームに戻るか、/searchにリダイレクト
      // 今回は/searchにリダイレクトし、SearchPageで全記事を表示するようにする
      navigate('/search');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="search"
        placeholder="記事を検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">検索</button>
    </form>
  );
};

export default SearchBar;
