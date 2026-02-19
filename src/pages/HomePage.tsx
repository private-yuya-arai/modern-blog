import React from 'react';
import usePosts from '../hooks/usePosts';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import { motion, Variants } from 'framer-motion';
import './HomePage.css';

const POSTS_PER_PAGE = 9; // 3x3 grid

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

  // Featured post (latest one on page 1)
  const featuredPost = currentPage === 1 ? posts[0] : null;
  const gridPosts = currentPage === 1 ? currentPosts.slice(1) : currentPosts;

  return (
    <div className="home-page-wrapper">
      {featuredPost && (
        <section className="featured-section">
          <div className="featured-container">
            <motion.div
              className="featured-image-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {featuredPost.image ? (
                <Link to={`/post/${featuredPost.slug}`}>
                  <img src={featuredPost.image} alt={featuredPost.title} className="featured-image" />
                </Link>
              ) : (
                <div className="featured-placeholder" />
              )}
            </motion.div>
            <motion.div
              className="featured-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="featured-label">LATEST STORY</span>
              <h2 className="featured-title">
                <Link to={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              <Link to={`/post/${featuredPost.slug}`} className="read-more-btn">READ STORY</Link>
            </motion.div>
          </div>
        </section>
      )}

      <div className="home-page-layout">
        <div className="main-column">
          <div className="section-header">
            <h3>THE EDIT</h3>
          </div>

          <motion.div
            className="post-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {gridPosts.map(post => (
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
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={location.pathname} />
        </div>

        {/* Sidebar could be optional or styled differently. Keeping for now but check layout. */}
        <Sidebar />
      </div>
    </div>
  );
};

export default HomePage;
