import React from 'react';
import { Link } from 'react-router-dom';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string; // ページネーションのベースとなるパス (例: / または /category/tech)
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath = '/' }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination">
      {currentPage > 1 && (
        <Link to={`${basePath}?page=${currentPage - 1}`} className="pagination-item prev">
          &laquo; 前へ
        </Link>
      )}

      {pageNumbers.map(number => (
        <Link
          key={number}
          to={`${basePath}?page=${number}`}
          className={`pagination-item ${number === currentPage ? 'active' : ''}`}
        >
          {number}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link to={`${basePath}?page=${currentPage + 1}`} className="pagination-item next">
          次へ &raquo;
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
