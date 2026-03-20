import React from 'react';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} title="Theme">
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
