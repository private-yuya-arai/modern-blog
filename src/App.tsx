import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs'; // Breadcrumbsをインポート
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Breadcrumbs /> {/* ここに配置 */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;