import React, { useEffect, useState } from 'react';

export default function IdeaBoard({ onToast }) {
  const [ideas, setIdeas] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('AI & NLP');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchIdeas = () => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setIdeas(data.data);
        }
      })
      .catch(err => console.error('Ideas load error:', err));
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleVote = async (id) => {
    try {
      const res = await fetch(`/api/ideas/${id}/vote`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: data.data.votes } : i));
        onToast?.('আইডিয়ায় ভোট সফলভাবে যুক্ত হয়েছে!', 'success');
      }
    } catch (err) {
      console.error('Vote idea error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      onToast?.('অনুগ্রহ করে শিরোনাম ও বিবরণ পূরণ করুন।', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || 'উন্মুক্ত চিন্তক',
          country: 'গ্লোবাল',
          category,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onToast?.('চমৎকার! আপনার আইডিয়াটি প্রস্তাবনা বোর্ডে যুক্ত হয়েছে।', 'success');
        setTitle('');
        setAuthor('');
        setDescription('');
        fetchIdeas();
      }
    } catch (err) {
      console.error('Submit idea error:', err);
      onToast?.('আইডিয়া জমা দেওয়া যায়নি।', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" id="ideas">
      <div className="container">
        <div className="section-head">
          <span className="pill-badge pill-gold">কমিউনিটি উদ্ভাবন</span>
          <h2 className="section-title">উদ্ভাবনী আইডিয়া ও প্রস্তাবনা বোর্ড</h2>
          <p className="section-desc">
            বাংলার অগ্রযাত্রায় আপনার কোনো নতুন আইডিয়া বা প্রজেক্ট পরিকল্পনা থাকলে শেয়ার করুন ও সেরা প্রস্তাবনাগুলোতে ভোট দিন।
          </p>
        </div>

        {/* Idea Submission Form */}
        <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto 40px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  আইডিয়ার শিরোনাম:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: উন্মুক্ত বাংলা উইকি-কোড লাইব্রেরি"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  আপনার নাম:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: ড. রূপক রায়"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  ক্যাটাগরি:
                </label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="AI & NLP">এআই ও ভাষা প্রযুক্তি</option>
                  <option value="Literature">সাহিত্য ও অনুবাদ</option>
                  <option value="Science">বিজ্ঞান ও শিক্ষা</option>
                  <option value="Animation">অ্যানিমেশন ও পপ-কালচার</option>
                  <option value="Policy">নীতি ও প্রাতিষ্ঠানিক</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                প্রকল্পের বিস্তারিত বিবরণ ও উদ্দেশ্য:
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="প্রকল্পটি কীভাবে বাংলা ভাষা ও সমাজকে এগিয়ে নেবে..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary-hero"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              <span>💡</span> {submitting ? 'আইডিয়া যুক্ত হচ্ছে...' : 'আইডিয়া সাবমিট করুন'}
            </button>
          </form>
        </div>

        {/* Ideas Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {ideas.map((item) => (
            <div key={item.id} className="pledge-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="tok-badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold-neon)' }}>
                    {item.category}
                  </span>
                  <button
                    className="tok-preset-btn"
                    onClick={() => handleVote(item.id)}
                    style={{ borderColor: 'rgba(245,158,11,0.3)', color: 'var(--gold-neon)' }}
                  >
                    ▲ ভোট ({item.votes})
                  </button>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  প্রস্তাবক: {item.author} ({item.country})
                </div>
                <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
