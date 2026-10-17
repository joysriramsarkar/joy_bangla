import React from 'react';

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div 
        className="toast"
        style={{
          borderColor: type === 'error' ? 'var(--red-neon)' : 'var(--green-neon)',
        }}
      >
        <span>{type === 'error' ? '⚠️ ' : '✅ '}</span>
        {message}
      </div>
    </div>
  );
}
