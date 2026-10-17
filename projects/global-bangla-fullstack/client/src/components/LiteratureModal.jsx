import React, { useEffect, useState } from 'react';

const toBengaliNumber = (num) => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bn[d]);
};

export default function LiteratureModal({ book, fontSize, onIncreaseFont, onDecreaseFont, onClose }) {
  const [copied, setCopied] = useState(false);
  const [textAlign, setTextAlign] = useState('center'); // 'center' | 'left'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!book) return null;

  // Determine if content is poetry or prose
  const isPoetry =
    book.genre?.includes('কবিতা') ||
    book.genre?.includes('কাব্য') ||
    (book.full_text && book.full_text.split('\n').length > 6);

  // Split into stanzas (separated by double newline or blank lines)
  const stanzas = book.full_text
    ? book.full_text.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const totalLines = stanzas.reduce(
    (acc, s) => acc + s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).length,
    0
  );

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${book.title}\nলেখক: ${book.author} (${book.era})\n\n${book.full_text}\n\n— জয় বাংলা ডিজিটাল মহাফেজখানা`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reader-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="reader-header">
          <div className="reader-header-info">
            <div className="reader-badge-row">
              <span className="lit-genre-badge">{book.genre}</span>
              {isPoetry ? (
                <span className="poem-stats-badge">
                  📜 {toBengaliNumber(stanzas.length)}টি স্তবক • {toBengaliNumber(totalLines)}টি চরণ
                </span>
              ) : (
                <span className="poem-stats-badge">
                  📖 {toBengaliNumber(stanzas.length)}টি অনুচ্ছেদ
                </span>
              )}
            </div>
            <h3 className="reader-title">{book.title}</h3>
            <div className="reader-meta">
              <span className="reader-author">{book.author}</span>
              <span className="reader-sep">•</span>
              <span>{book.era}</span>
              <span className="reader-sep">•</span>
              <span>পাঠের সময়: {book.read_time}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="reader-controls">
            {/* Alignment toggle for poetry */}
            {isPoetry && (
              <div className="reader-btn-group" title="বিন্যাস শৈলী পরিবর্তন করুন">
                <button
                  className={`reader-tool-btn ${textAlign === 'center' ? 'active' : ''}`}
                  onClick={() => setTextAlign('center')}
                  title="স্তম্ভাকার কেন্দ্রস্থ ভিউ"
                >
                  ☵ কেন্দ্রস্থ
                </button>
                <button
                  className={`reader-tool-btn ${textAlign === 'left' ? 'active' : ''}`}
                  onClick={() => setTextAlign('left')}
                  title="বামে সারিবদ্ধ ভিউ"
                >
                  ≡ বামে
                </button>
              </div>
            )}

            {/* Font Size Adjusters */}
            <div className="reader-btn-group" title="ফন্ট সাইজ পরিবর্তন করুন">
              <button
                className="reader-tool-btn"
                onClick={onDecreaseFont}
                title="ফন্ট ছোট করুন"
              >
                A-
              </button>
              <span className="reader-font-indicator">{toBengaliNumber(fontSize)}px</span>
              <button
                className="reader-tool-btn"
                onClick={onIncreaseFont}
                title="ফন্ট বড় করুন"
              >
                A+
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`reader-tool-btn copy-btn ${copied ? 'copied' : ''}`}
              title="সম্পূর্ণ রচনা কপি করুন"
            >
              {copied ? '✓ অনুলিপি সম্পন্ন' : '📋 কপি'}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="reader-close-btn"
              title="বন্ধ করুন (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Reader Body with Poetry Stanzas or Prose Paragraphs */}
        <div
          className={`reader-body ${isPoetry ? 'reader-poetry-mode' : 'reader-prose-mode'} align-${textAlign}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {isPoetry ? (
            <div className="poem-container">
              <div className="poem-ornament-top">
                <span className="ornament-line"></span>
                <span className="ornament-star">✦ ✦ ✦</span>
                <span className="ornament-line"></span>
              </div>

              {stanzas.map((stanza, sIdx) => {
                const lines = stanza.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                return (
                  <div key={sIdx} className="poem-stanza">
                    <div className="stanza-tag">
                      <span className="stanza-tag-text">স্তবক {toBengaliNumber(sIdx + 1)}</span>
                    </div>

                    <div className="stanza-verses">
                      {lines.map((line, lIdx) => {
                        const trimmed = line.trim();
                        // Refrain or highlighted invocation lines
                        const isRefrain =
                          trimmed.startsWith('বল বীর') ||
                          trimmed.startsWith('আমি চির-উন্নত') ||
                          trimmed.startsWith('মহা-বিদ্রোহী') ||
                          trimmed.startsWith('বিদ্রোহী রণ-ক্লান্ত') ||
                          trimmed.startsWith('কাণ্ডারী!') ||
                          trimmed.endsWith('—');

                        return (
                          <div
                            key={lIdx}
                            className={`poem-line ${isRefrain ? 'poem-line-refrain' : ''}`}
                          >
                            <span className="poem-line-text">{trimmed}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="poem-ornament-bottom">
                <span className="ornament-line"></span>
                <div className="poem-ending-badge">
                  <span className="ending-floral">❦</span>
                  <span className="ending-text">সমাপ্ত</span>
                  <span className="ending-floral">❦</span>
                </div>
                <span className="ornament-line"></span>
              </div>
            </div>
          ) : (
            <div className="prose-container">
              {stanzas.map((paragraph, pIdx) => (
                <p key={pIdx} className="prose-paragraph">
                  {paragraph}
                </p>
              ))}
              <div className="poem-ornament-bottom">
                <span className="ornament-line"></span>
                <div className="poem-ending-badge">
                  <span className="ending-floral">❦</span>
                  <span className="ending-text">সমাপ্ত</span>
                  <span className="ending-floral">❦</span>
                </div>
                <span className="ornament-line"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
