import React from 'react';
import '../index.css';

interface HeaderProps {
  onLogout: () => void;
  partnerName: string;
  lastSeen: string;
  isOnline: boolean;
  isTyping: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogout, 
  partnerName, 
  lastSeen, 
  isOnline,
  isTyping
}) => {
  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <div className="chat-avatar">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ width: '24px', height: '24px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            
            {}
            {isOnline && (
              <div className="online-indicator" style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                backgroundColor: '#48bb78',
                borderRadius: '50%',
                border: '2px solid white',
                boxSizing: 'content-box'
              }} />
            )}
          </div>
        </div>
        
        <div className="chat-info">
          <h1>{partnerName}</h1>
          <p style={{ 
            color: isOnline ? '#48bb78' : 'var(--text-secondary)',
            height: '20px',
            transition: 'all 0.3s ease'
          }}>
            {isTyping ? (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                печатает...
              </span>
            ) : isOnline ? (
              'онлайн'
            ) : (
              lastSeen
            )}
          </p>
        </div>
        
        <button 
          className="chat-logout" 
          onClick={onLogout}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="var(--primary)"
            style={{ width: '24px', height: '24px' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;