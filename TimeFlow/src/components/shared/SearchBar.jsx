import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search tasks..." }) {
  const [query, setQuery] = useState('');
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query.toLowerCase().trim());
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: isDark ? '#1A1F1A' : '#F8F8F8',
      padding: '12px 0',
      marginBottom: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isDark ? '#242B24' : '#fff',
        borderRadius: '12px',
        padding: '10px 14px',
        border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`
      }}>
        <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '15px',
            color: isDark ? '#E8F0E8' : '#1A1A1A'
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: isDark ? '#9CA59C' : '#8E8E93'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
