import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import PostPage from './pages/PostPage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import TagPage from './pages/TagPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';

import './index.css';
import './styles/theme.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'post/:slug',
        element: <PostPage />,
      },
      {
        path: 'category/:categoryName',
        element: <CategoryPage />,
      },
      {
        path: 'tag/:tagName',
        element: <TagPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);