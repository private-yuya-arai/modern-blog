import React from 'react';
import usePosts from '../hooks/usePosts';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import { motion, Variants } from 'framer-motion';
import './HomePage.css';

const POSTS_PER_PAGE = 10; // Adjusted for new layout

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const HomePage: React.FC = () => {
  const { posts, loading } = usePosts();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  // The very first post is the "Featured" post (Hero)
  const latestPost = posts[0];

  return (
    <div className="home-page-wrapper">
      {currentPage === 1 && latestPost && <HeroSection latestPost={latestPost} />}

      <div className="home-page-layout">
        <div className="main-column">
          <div className="section-header">
            <h3>RECENT STORIES</h3>
          </div>

          <motion.div
            className="post-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPosts.map(post => (
              <motion.article
                key={post.slug}
                className="post-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
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
                    <h3 className="post-card-title">{post.title}</h3>
                    <time dateTime={post.date} className="post-card-date">{post.date}</time>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={location.pathname} />
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  );
};

export default HomePage;
