import React, { useEffect, useState } from 'react';

export default function DictionarySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDictionary = (q = '') => {
    setLoading(true);
    fetch(`/api/dictionary?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setResults(data.data);
        }
      })
      .catch(err => console.error('Dictionary load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDictionary(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="glass-panel">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          উন্মুক্ত আধুনিক বাংলা অভিধান ও ব্যুৎপত্তি
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#9ca3af' }}>
          প্রমিত বাংলা অর্থ, পদবিন্যাস, উচ্চারণ ও সমার্থক শব্দ অনুসন্ধানের মুক্ত কর্পাস।
        </p>
      </div>

      <div className="dict-search-box">
        <input
          type="text"
          className="form-input"
          placeholder="শব্দ খুঁজুন (যেমন: বিজ্ঞান, জ্ঞান, সাহিত্য, সংস্কৃতি)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="dict-results-list">
        {loading && <div style={{ color: '#94a3b8', textAlign: 'center', padding: '16px' }}>অনুসন্ধান চলছে...</div>}
        {!loading && results.length === 0 && (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '16px' }}>কোনো শব্দ পাওয়া যায়নি।</div>
        )}
        {!loading && results.map((item) => (
          <div key={item.id} className="dict-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginRight: '10px' }}>
                  {item.word_bn}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--green-neon)', fontWeight: 700, background: 'rgba(0,229,153,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                  {item.part_of_speech}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--gold-neon)', fontFamily: 'monospace' }}>
                {item.word_en} {item.pronunciation && `• [${item.pronunciation}]`}
              </span>
            </div>

            <p style={{ fontSize: '0.96rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '10px' }}>
              {item.meaning}
            </p>

            {item.example_sentence && (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', borderLeft: '2px solid var(--green-neon)' }}>
                <b>উদাহরণ:</b> {item.example_sentence}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
