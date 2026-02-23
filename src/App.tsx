import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs'; // Breadcrumbsをインポート
import './App.css';

import { AIProvider } from './AIContext';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  return (
    <AIProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Breadcrumbs />
          <Outlet />
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </AIProvider>
  );
};

export default App;