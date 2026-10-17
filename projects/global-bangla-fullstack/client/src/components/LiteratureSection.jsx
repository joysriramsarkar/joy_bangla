import React, { useEffect, useState } from 'react';
import LiteratureModal from './LiteratureModal';

export default function LiteratureSection() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    fetch('/api/literature')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setBooks(data.data);
        }
      })
      .catch(err => console.error('Literature load error:', err));
  }, []);

  const openBook = async (id) => {
    try {
      const res = await fetch(`/api/literature/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedBook(data.data);
      }
    } catch (err) {
      console.error('Failed to load book:', err);
    }
  };

  return (
    <section className="section" id="literature">
      <div className="container">
        <div className="section-head">
          <span className="pill-badge pill-gold">ডিজিটাল মহাফেজখানা</span>
          <h2 className="section-title">ডিজিটাল ক্লাসিক সাহিত্যাগার</h2>
          <p className="section-desc">
            বাংলা ধ্রুপদী সাহিত্যকে উন্মুক্ত টেক্সট ফরম্যাটে পড়ার প্ল্যাটফর্ম। ক্লিক করে সম্পূর্ণ রচনা পাঠ করুন।
          </p>
        </div>

        <div className="lit-grid">
          {books.map((b) => (
            <div
              key={b.id}
              className="lit-card"
              onClick={() => openBook(b.id)}
            >
              <div>
                <span className="lit-badge">{b.genre}</span>
                <h3 className="lit-title">{b.title}</h3>
                <div className="lit-author">{b.author} • {b.era}</div>
                <p className="lit-excerpt">"{b.excerpt}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px', fontSize: '0.85rem', color: 'var(--gold-neon)' }}>
                <span>📖 সম্পূর্ণ পড়ুন ({b.read_time})</span>
                <span>➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <LiteratureModal
          book={selectedBook}
          fontSize={fontSize}
          onIncreaseFont={() => setFontSize(prev => Math.min(prev + 2, 28))}
          onDecreaseFont={() => setFontSize(prev => Math.max(prev - 2, 14))}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </section>
  );
}
