import { useState, useEffect } from 'react';
import { useDarkMode } from '../../utils/useDarkMode';
import { SearchIcon, CloseIcon } from '../../icons';

export default function SearchBar({ onSearch, placeholder = "Search tasks..." }) {
  const [query, setQuery] = useState('');
  const isDark = useDarkMode();

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch && onSearch(query.toLowerCase().trim());
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: isDark ? '#1A1F1A' : '#f0f4f1',
      padding: '8px 0',
      marginBottom: '10px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isDark ? '#242B24' : 'rgba(255,255,255,0.82)',
        borderRadius: '16px',
        padding: '8px 14px',
        border: `1px solid ${isDark ? '#4A5A4A' : 'rgba(0,0,0,0.06)'}`
      }}>
        <SearchIcon size={14} style={{ marginRight: '8px', opacity: 0.5 }} />
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
            <CloseIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
