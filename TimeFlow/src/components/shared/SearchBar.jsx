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
      padding: '8px 0',
      marginBottom: '10px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isDark ? '#242B24' : 'rgba(0,0,0,0.04)',
        borderRadius: '16px',
        padding: '8px 14px',
        border: `1px solid ${isDark ? '#4A5A4A' : 'transparent'}`
      }}>
        <span style={{ fontSize: '14px', marginRight: '8px', opacity: 0.5 }}>🔍</span>
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
            fontSize: '14px',
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
