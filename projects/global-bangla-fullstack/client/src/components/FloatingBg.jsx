import React, { useMemo } from 'react';

export default function FloatingBg() {
  const chars = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ক', 'খ', 'গ', 'ঘ', 'ড়', 'ঢ়', 'ৎ', 'ং', 'ঃ', 'ঁ', 'জ্ঞ', 'ক্ষ'];
  
  const items = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      left: `${(i * 5.4 + Math.random() * 4) % 96}%`,
      fontSize: `${2.4 + (i % 3) * 1.2}rem`,
      animationDuration: `${16 + (i % 5) * 4}s`,
      animationDelay: `${(i * 1.7) % 12}s`,
    }));
  }, []);

  return (
    <div className="floating-bg" aria-hidden="true">
      {items.map(item => (
        <span
          key={item.id}
          className="float-char"
          style={{
            left: item.left,
            fontSize: item.fontSize,
            animationDuration: item.animationDuration,
            animationDelay: item.animationDelay,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
