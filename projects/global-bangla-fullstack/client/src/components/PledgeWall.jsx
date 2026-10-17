import React, { useEffect, useState } from 'react';

export default function PledgeWall({ onToast }) {
  const [pledges, setPledges] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('ভারত (India)');
  const [role, setRole] = useState('সফটওয়্যার ইঞ্জিনিয়ার');
  const [commitment, setCommitment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPledges = () => {
    fetch('/api/pledges')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPledges(data.data);
        }
      })
      .catch(err => console.error('Pledges load error:', err));
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !commitment.trim()) {
      onToast?.('অনুগ্রহ করে আপনার নাম ও অঙ্গীকার পূরণ করুন।', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim(),
          role: role.trim(),
          commitment: commitment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onToast?.('ধন্যবাদ! আপনার অঙ্গীকার গ্লোবাল বাংলা ওয়ালে যুক্ত হয়েছে।', 'success');
        setName('');
        setCommitment('');
        fetchPledges();
      }
    } catch (err) {
      console.error('Pledge submit error:', err);
      onToast?.('অঙ্গীকার জমা দেওয়া যায়নি।', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" id="pledges" style={{ background: '#050914', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-head">
          <span className="pill-badge pill-emerald">বৈশ্বিক ঐকমত্য</span>
          <h2 className="section-title">গ্লোবাল বাংলা অঙ্গীকার প্রাচীর</h2>
          <p className="section-desc">
            বিশ্বজুড়ে যেখানেই থাকুন না কেন—মাতৃভাষার বিকাশ, প্রযুক্তি চর্চা ও শিক্ষায় আপনার ব্যক্তিগত অঙ্গীকার ব্যক্ত করুন।
          </p>
        </div>

        {/* Submission Form */}
        <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto 40px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  আপনার পূর্ণ নাম:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: অনির্বাণ চক্রবর্তী"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  বসবাসরত দেশ / অঞ্চল:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: ভারত, বাংলাদেশ, আমেরিকা..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  পেশা / ভূমিকা:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: গবেষক, শিক্ষক, শিক্ষার্থী..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                বাংলার জন্য আপনার সুনির্দিষ্ট অঙ্গীকার:
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="বাংলা ভাষায় অন্তত একটি উন্মুক্ত গবেষণা বা কনটেন্ট তৈরি করব..."
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary-hero"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              <span>✍️</span> {submitting ? 'অঙ্গীকার যুক্ত হচ্ছে...' : 'অঙ্গীকার প্রাচীরে যুক্ত করুন'}
            </button>
          </form>
        </div>

        {/* Pledges Grid */}
        <div className="pledges-grid">
          {pledges.map((p) => (
            <div key={p.id} className="pledge-card">
              <div className="pledge-header">
                <span className="pledge-name">{p.name}</span>
                <span className="pledge-country">{p.country}</span>
              </div>
              <div className="pledge-role">{p.role}</div>
              <p className="pledge-body">"{p.commitment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
