import React, { useEffect, useState } from 'react';

export default function TechGlossary({ onToast }) {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchGlossary = () => {
    setLoading(true);
    fetch(`/api/glossary?q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTerms(data.data);
        }
      })
      .catch(err => console.error('Glossary load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGlossary();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleVote = async (id) => {
    try {
      const res = await fetch(`/api/glossary/${id}/vote`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setTerms(prev => prev.map(t => t.id === id ? { ...t, votes: data.data.votes } : t));
        onToast?.('পরিভাষায় সমর্থন ভোট সফলভাবে যুক্ত হয়েছে!', 'success');
      }
    } catch (err) {
      console.error('Vote glossary error:', err);
    }
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            আধুনিক বিজ্ঞান ও প্রযুক্তি পরিভাষাকোষ
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#9ca3af' }}>
            আইটি, কৃত্রিম বুদ্ধিমত্তা ও বিজ্ঞানের জটিল ধারণার প্রমিত বাংলা পরিভাষা সংগ্রহ ও কমিউনিটি স্বীকৃতি।
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: '1 1 260px' }}
          placeholder="পরিভাষা খুঁজুন (যেমন: কৃত্রিম বুদ্ধিমত্তা, ক্লাউড)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ flex: '0 1 180px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">সমস্ত ক্যাটাগরি</option>
          <option value="AI">কৃত্রিম বুদ্ধিমত্তা (AI)</option>
          <option value="Computing">কম্পিউটিং ও আর্কিটেকচার</option>
          <option value="Software">সফটওয়্যার ও কোডিং</option>
          <option value="Data">ডাটা ও অ্যানালিটিক্স</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {loading && <div style={{ color: '#94a3b8', padding: '20px', gridColumn: '1/-1', textAlign: 'center' }}>লোড হচ্ছে...</div>}
        {!loading && terms.length === 0 && (
          <div style={{ color: '#94a3b8', padding: '20px', gridColumn: '1/-1', textAlign: 'center' }}>কোনো পরিভাষা পাওয়া যায়নি।</div>
        )}
        {!loading && terms.map((t) => (
          <div key={t.id} className="pledge-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="tok-badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe' }}>
                  {t.category}
                </span>
                <button
                  className="tok-preset-btn"
                  onClick={() => handleVote(t.id)}
                  style={{ borderColor: 'rgba(0,229,153,0.3)', color: 'var(--green-neon)' }}
                >
                  ▲ সমর্থন ({t.votes})
                </button>
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                {t.term_bn}
              </h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--gold-neon)', fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: '10px' }}>
                {t.term_en} {t.phonetic && `• [${t.phonetic}]`}
              </div>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
                {t.definition}
              </p>
            </div>

            {t.example && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.84rem', color: '#94a3b8', borderLeft: '2px solid var(--green-neon)' }}>
                <b>প্রয়োগ:</b> {t.example}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
