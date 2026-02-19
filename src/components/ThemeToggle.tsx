import React from 'react';
import useTheme from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      {theme === 'light' ? 'ダークモードへ' : 'ライトモードへ'}
    </button>
  );
};

export default ThemeToggle;
