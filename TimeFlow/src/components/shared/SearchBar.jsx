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
    <div className="list-item-1" style={{
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
        background: isDark ? 'rgba(36,43,36,0.8)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '10px 14px',
        border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,110,59,0.1)'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s'
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
