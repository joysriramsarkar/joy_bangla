import React, { useState } from 'react';

export default function TokenizerLab() {
  const presets = [
    { label: 'শিক্ষার্থী ও এআই', text: 'বিশ্ববিদ্যালয়ে গবেষণারত শিক্ষার্থীরা বাংলায় কৃত্রিম বুদ্ধিমত্তা চর্চা করছেন।' },
    { label: 'গীতাঞ্জলি সাহিত্য', text: 'রবীন্দ্রনাথ ঠাকুরের গীতাঞ্জলি বিশ্বসাহিত্যের এক চিরন্তন ও অনন্য গৌরব।' },
    { label: 'কোয়ান্টাম বিজ্ঞান', text: 'কোয়ান্টাম মেকানিক্সে কণার উপরিপাতন ধর্ম আধুনিক কম্পিউটিংকে দ্রুততর করছে।' },
  ];

  const [input, setInput] = useState(presets[0].text);
  const [smartTokens, setSmartTokens] = useState(['বিশ্ববিদ্যালয়ে', 'গবেষণারত', 'শিক্ষার্থীরা', 'বাংলায়', 'কৃত্রিম', 'বুদ্ধিমত্তা', 'চর্চা', 'করছেন।']);
  const [legacyTokens, setLegacyTokens] = useState(['ব', 'ি', 'শ', '্', 'ব', 'ব', 'ি', 'দ', '্', 'য', 'া', 'ল', 'য', '়', 'ে', '...']);
  const [efficiency, setEfficiency] = useState(87);
  const [loading, setLoading] = useState(false);

  const analyzeTokens = async (textToAnalyze) => {
    const text = textToAnalyze || input;
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSmartTokens(data.data.smart_tokens || []);
        setLegacyTokens(data.data.legacy_tokens_sample || []);
        setEfficiency(data.data.token_savings_percent || 0);
      }
    } catch (err) {
      console.error('Tokenizer error:', err);
      // Fallback local calculation
      const words = text.trim().split(/\s+/);
      const chars = text.split('');
      setSmartTokens(words);
      setLegacyTokens(chars.slice(0, 30));
      const savings = Math.round(((chars.length - words.length) / Math.max(chars.length, 1)) * 100);
      setEfficiency(Math.max(0, savings));
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (text) => {
    setInput(text);
    analyzeTokens(text);
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          বাংলা সাবওয়ার্ড বনাম ক্যারেক্টার টোকেনায়ন পরীক্ষা
        </h3>
        <span className="tok-badge good">
          {efficiency}% টোকেন সাশ্রয়
        </span>
      </div>

      <p style={{ fontSize: '0.94rem', color: '#9ca3af', marginBottom: '20px' }}>
        বিশ্বের সর্বাধুনিক এআই মডেলগুলো (LLMs) বাংলা লেখাকে কীভাবে টোকেনাইজের মাধ্যমে মেমোরিতে প্রসেস করে তা সরাসরি পর্যবেক্ষণ করুন।
      </p>

      <div className="tok-presets">
        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 700 }}>উদাহরণ বাক্য:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            className="tok-preset-btn"
            onClick={() => handlePreset(p.text)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ margin: '18px 0' }}>
        <textarea
          className="form-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="যেকোনো বাংলা বাক্য এখানে লিখুন..."
        />
      </div>

      <button
        className="btn-primary-hero"
        style={{ padding: '10px 24px', fontSize: '0.95rem' }}
        onClick={() => analyzeTokens()}
        disabled={loading}
      >
        <span>⚡</span> {loading ? 'বিশ্লেষণ চলছে...' : 'টোকেন বিশ্লেষণ করুন'}
      </button>

      <div className="tok-grid">
        {/* Smart Subwords Card */}
        <div className="tok-card">
          <div className="tok-card-header">
            <span style={{ fontWeight: 700, color: '#00e599' }}>আধুনিক বাংলা সাবওয়ার্ড টোকেন (BPE)</span>
            <span className="tok-badge good">{smartTokens.length} টোকেন</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '12px' }}>
            অর্থপূর্ণ শব্দখণ্ড অনুযায়ী বিভক্ত হওয়ায় কম টোকেনে সম্পূর্ণ তথ্য প্রকাশ পায়:
          </p>
          <div className="tok-chips-container">
            {smartTokens.map((t, idx) => (
              <span key={idx} className="tok-chip smart">{t}</span>
            ))}
          </div>
        </div>

        {/* Legacy Character / Byte Card */}
        <div className="tok-card">
          <div className="tok-card-header">
            <span style={{ fontWeight: 700, color: '#ff334b' }}>আদিম ক্যারেক্টার / বাইট স্প্লিটিং</span>
            <span className="tok-badge bad">{input.length} অক্ষর/বাইট</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '12px' }}>
            অপ্রমিত টোকেনাইজারে প্রতিটি যুক্তবর্ণ ও মাত্রা একাধিক টোকেনে ভেঙে মেমোরির অপচয় ঘটায়:
          </p>
          <div className="tok-chips-container">
            {legacyTokens.map((c, idx) => (
              <span key={idx} className="tok-chip legacy">{c}</span>
            ))}
            {input.length > 30 && <span className="tok-chip legacy">...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
