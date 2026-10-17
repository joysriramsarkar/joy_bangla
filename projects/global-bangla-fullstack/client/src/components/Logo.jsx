import React from 'react';

export default function Logo({ size = 42, className = '' }) {
  return (
    <div 
      className={`nav-logo-box ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title="গ্লোবাল বাংলা প্রতীক"
    >
      <svg 
        viewBox="0 0 120 120" 
        width={size} 
        height={size}
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 229, 153, 0.35))' }}
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Outer Circular Medallion */}
        <circle cx="60" cy="60" r="54" fill="url(#logoBgGrad)" stroke="url(#logoGoldGrad)" strokeWidth="3.5" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="4 6" />

        {/* Orbital Node Accents */}
        <circle cx="60" cy="6" r="3.5" fill="#f59e0b" />
        <circle cx="114" cy="60" r="3.5" fill="#00e599" />
        <circle cx="60" cy="114" r="3.5" fill="#f59e0b" />
        <circle cx="6" cy="60" r="3.5" fill="#00e599" />

        {/* Central Cultural Glyphs: Open Book Base & Bengali 'অ' */}
        <g transform="translate(60, 66) scale(0.95)">
          <path d="M-26,20 C-14,14 -2,17 0,22 C2,17 14,14 26,20 L24,24 C13,19 2,21 0,25 C-2,21 -13,19 -24,24 Z" fill="url(#logoGoldGrad)" />
          <text 
            x="0" 
            y="4" 
            textAnchor="middle" 
            fontFamily="'Hind Siliguri', 'Kalpurush', sans-serif" 
            fontSize="52" 
            fontWeight="900" 
            fill="#ffffff"
          >
            অ
          </text>
        </g>
      </svg>
    </div>
  );
}
