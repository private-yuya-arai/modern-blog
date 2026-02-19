import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split('/').filter(x => x);

  let breadcrumbPath = '';

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <Link to="/">ホーム</Link>
      {pathnames.map((value, index) => {
        breadcrumbPath += `/${value}`;
        const isLast = index === pathnames.length - 1;

        if (isLast) {
          return null; // 最後の項目（現在のページ名）は表示しない
        }
        
        // パラメータを含むパスの場合、パラメータの値を表示名にする
        let displayName = value;
        if (params.slug && value === params.slug) {
          displayName = '記事詳細'; // ここは実際の記事タイトルに置き換えるのが理想
        } else if (params.categoryName && value === params.categoryName) {
          displayName = decodeURIComponent(params.categoryName);
        } else if (params.tagName && value === params.tagName) {
          displayName = decodeURIComponent(params.tagName);
        } else if (value === 'post') {
          displayName = '記事';
        } else if (value === 'category') {
          displayName = 'カテゴリ';
        } else if (value === 'tag') {
          displayName = 'タグ';
        }

        const isIntermediatePath = value === 'post' || value === 'category' || value === 'tag';

        return (
          <span key={breadcrumbPath}>
            <span className="separator">&gt;</span>
            {isIntermediatePath ? (
              <span>{displayName}</span>
            ) : (
              <Link to={breadcrumbPath}>{displayName}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
