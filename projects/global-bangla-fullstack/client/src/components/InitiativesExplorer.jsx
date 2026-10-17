import React, { useState, useEffect, useCallback } from 'react';

const PILLARS = [
  { id: 'all', name: 'সমস্ত উদ্যোগ', icon: '🌐' },
  { id: 'ai_tech', name: '১. ভাষা প্রযুক্তি ও এআই', icon: '🤖', count: 60 },
  { id: 'literature', name: '২. সাহিত্য ও অনুবাদ', icon: '📚', count: 60 },
  { id: 'culture', name: '৩. সংস্কৃতি ও বিনোদন', icon: '🎭', count: 60 },
  { id: 'science', name: '৪. বিজ্ঞান ও উচ্চশিক্ষা', icon: '🔬', count: 60 },
  { id: 'governance', name: '৫. গভর্নেন্স ও লোকালাইজেশন', icon: '🏛️', count: 60 },
  { id: 'education', name: '৬. শিক্ষা ও শিশুতোষ ল্যাব', icon: '🎒', count: 60 },
  { id: 'diaspora', name: '৭. আন্তর্জাতিক ও ডায়াসপোরা', icon: '🌏', count: 60 },
  { id: 'commerce', name: '৮. বাণিজ্য ও স্টার্টআপ', icon: '💼', count: 60 },
  { id: 'accessibility', name: '৯. অন্তর্ভুক্তি ও অ্যাক্সেসিবিলিটি', icon: '♿', count: 60 },
  { id: 'community', name: '১০. কমিউনিটি ও তরুণ আন্দোলন', icon: '✊', count: 60 },
];

export default function InitiativesExplorer({ onToast }) {
  const [initiatives, setInitiatives] = useState([]);
  const [meta, setMeta] = useState({ total: 600, active: 0, in_progress: 0, planned: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('code');
  const [activeModalInit, setActiveModalInit] = useState(null);
  const [votedIds, setVotedIds] = useState(new Set());
  const [displayLimit, setDisplayLimit] = useState(24);

  // Community Submission Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    pillar_id: 'ai_tech',
    short_desc: '',
    full_desc: '',
    priority: 'high',
    target_year: '২০২৭'
  });
  const [submitting, setSubmitting] = useState(false);

  // Stable fetch function via useCallback
  const fetchInitiatives = useCallback(async (pillar, status, q, sort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (pillar !== 'all') params.append('pillar', pillar);
      if (status !== 'all') params.append('status', status);
      if (q && q.trim()) params.append('q', q.trim());
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/initiatives?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setInitiatives(json.data);
        if (json.meta) setMeta(json.meta);
      }
    } catch (err) {
      console.error('উদ্যোগ লোডে সমস্যা:', err);
    } finally {
      setLoading(false);
    }
  }, []); // no external deps — args passed directly

  // Fetch on filter/sort changes
  useEffect(() => {
    setDisplayLimit(24);
    fetchInitiatives(selectedPillar, statusFilter, searchQuery, sortBy);
  }, [selectedPillar, statusFilter, sortBy]); // eslint-disable-line

  // Debounced search — only fires 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayLimit(24);
      fetchInitiatives(selectedPillar, statusFilter, searchQuery, sortBy);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line

  // Handle Voting
  const handleVote = async (e, id, code) => {
    e.stopPropagation();
    if (votedIds.has(id)) {
      if (onToast) onToast('আপনি ইতিমধ্যে এই উদ্যোগে সমর্থন জানিয়েছেন!', 'info');
      return;
    }
    try {
      const res = await fetch(`/api/initiatives/${id}/vote`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setInitiatives(prev => prev.map(item => item.id === id ? { ...item, votes: json.data.votes } : item));
        if (activeModalInit && activeModalInit.id === id) {
          setActiveModalInit(prev => ({ ...prev, votes: json.data.votes }));
        }
        setVotedIds(prev => new Set([...prev, id]));
        if (onToast) onToast(`ধন্যবাদ! '${code}' উদ্যোগে সমর্থন যুক্ত হয়েছে।`, 'success');
      }
    } catch {
      if (onToast) onToast('ভোট প্রদানে ত্রুটি হয়েছে।', 'error');
    }
  };

  // Handle New Initiative Submission
  const handleSubmitInitiative = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.short_desc.trim()) {
      if (onToast) onToast('অনুগ্রহ করে উদ্যোগের শিরোনাম ও সারসংক্ষেপ লিখুন।', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const pillarObj = PILLARS.find(p => p.id === formData.pillar_id);
      const payload = {
        ...formData,
        pillar_name: pillarObj ? pillarObj.name.replace(/^[০-৯.\s]+/, '') : 'কমিউনিটি প্রস্তাবিত'
      };
      const res = await fetch('/api/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setInitiatives(prev => [json.data, ...prev]);
        setShowSubmitModal(false);
        setFormData({ title: '', pillar_id: 'ai_tech', short_desc: '', full_desc: '', priority: 'high', target_year: '২০২৭' });
        if (onToast) onToast(`অভিনন্দন! আপনার উদ্যোগ (${json.data.code}) সফলভাবে যুক্ত হয়েছে!`, 'success');
      } else {
        if (onToast) onToast(json.error || 'উদ্যোগ যুক্ত করতে সমস্যা হয়েছে।', 'error');
      }
    } catch {
      if (onToast) onToast('উদ্যোগ যুক্ত করতে নেটওয়ার্ক সমস্যা হয়েছে।', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Export initiatives as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(initiatives, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `bangla_initiatives_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (onToast) onToast('রোডম্যাপ JSON ডাউনলোড হয়েছে।', 'success');
  };

  const resetFilters = () => {
    setSelectedPillar('all');
    setStatusFilter('all');
    setSearchQuery('');
    setSortBy('code');
    setDisplayLimit(24);
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="init-status-badge init-active"><span className="init-pulse green" /> সক্রিয়</span>;
      case 'in_progress':
        return <span className="init-status-badge init-progress"><span className="init-pulse amber" /> চলমান</span>;
      case 'planned':
      default:
        return <span className="init-status-badge init-planned"><span className="init-pulse cyan" /> পরিকল্পিত</span>;
    }
  };

  const priorityBadge = (priority) =>
    priority === 'high'
      ? <span className="init-priority-badge high">শীর্ষ অগ্রাধিকার</span>
      : <span className="init-priority-badge medium">কৌশলগত</span>;

  return (
    <section id="initiatives" className="section initiatives-section">
      <div className="container">

        {/* Section Header */}
        <div className="section-head">
          <span className="pill-badge pill-emerald">🚀 বাংলার বিকাশে ৬০০টি সুনির্দিষ্ট কর্মপরিকল্পনা</span>
          <h2 className="section-title">
            বিশ্বমঞ্চে বাংলার জন্য&nbsp;
            <span className="hero-title-gradient">৬০০ কৌশলগত উদ্যোগ</span>
          </h2>
          <p className="section-desc">
            কেবল আবেগে সীমাবদ্ধ না থেকে ভাষা প্রযুক্তি, এআই, বিশ্বমানের সাহিত্য, বিজ্ঞান গবেষণা,
            গভর্নেন্স ও অর্থনীতির সংযোগে ১০টি স্তম্ভে বিভক্ত ৬০০টি বাস্তবমুখী উদ্যোগ।
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="initiatives-stats-row">
          <div className="init-stat-box">
            <div className="stat-num emerald">{meta.total || initiatives.length}+</div>
            <div className="stat-label">মোট কৌশলগত উদ্যোগ</div>
          </div>
          <div className="init-stat-box">
            <div className="stat-num sky">১০টি</div>
            <div className="stat-label">মূল রূপান্তর স্তম্ভ</div>
          </div>
          <div className="init-stat-box">
            <div className="stat-num emerald">{meta.active + meta.in_progress}+</div>
            <div className="stat-label">সক্রিয় ও প্রগতিশীল</div>
          </div>
          <div className="init-stat-box">
            <div className="stat-num gold">২০৪০</div>
            <div className="stat-label">৫% বৈশ্বিক ওয়েব লক্ষ্যমাত্রা</div>
          </div>
        </div>

        {/* Pillar Tabs */}
        <div className="pillar-tabs-scroll">
          <div className="pillar-tabs-wrap">
            {PILLARS.map(p => (
              <button
                key={p.id}
                type="button"
                className={`pillar-filter-btn ${selectedPillar === p.id ? 'active' : ''}`}
                onClick={() => setSelectedPillar(p.id)}
              >
                <span className="p-icon">{p.icon}</span>
                <span className="p-name">{p.name}</span>
                {p.id !== 'all' && <span className="p-count">{p.count}</span>}
                {p.id === 'all' && <span className="p-count">{meta.total || 600}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="glass-panel initiatives-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              placeholder="উদ্যোগের নাম, কোড (INIT-...) বা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')} aria-label="clear">✕</button>
            )}
          </div>

          <div className="filter-group">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
              <option value="all">সমস্ত স্ট্যাটাস</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="in_progress">চলমান (In Progress)</option>
              <option value="planned">পরিকল্পিত (Planned)</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              <option value="code">সিরিয়াল কোড অনুসারে</option>
              <option value="votes">সর্বাধিক জনসমর্থন</option>
              <option value="target_year">বাস্তবায়ন বছর অনুসারে</option>
            </select>

            <button type="button" className="btn-outline-cyan export-btn" onClick={handleExportJSON}>
              📥 JSON ডাউনলোড
            </button>

            <button type="button" className="btn-neon-green" onClick={() => setShowSubmitModal(true)}>
              ➕ নতুন উদ্যোগ প্রস্তাব
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        <div className="results-indicator">
          <span>পাওয়া গেছে: <strong>{initiatives.length}</strong> টি উদ্যোগ</span>
          {selectedPillar !== 'all' && (
            <span className="active-filter-tag">
              স্তম্ভ: {PILLARS.find(p => p.id === selectedPillar)?.name}
              <button onClick={() => setSelectedPillar('all')}>✕</button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="active-filter-tag">
              স্ট্যাটাস: {statusFilter}
              <button onClick={() => setStatusFilter('all')}>✕</button>
            </span>
          )}
          {(selectedPillar !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button className="reset-filter-link" onClick={resetFilters}>সব রিসেট করুন</button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="init-spinner" />
            <p>উদ্যোগসমূহ লোড হচ্ছে...</p>
          </div>
        ) : initiatives.length === 0 ? (
          <div className="empty-state glass-panel">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🔎</span>
            <h3>কোনো উদ্যোগ মেলেনি</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>অনুসন্ধান শর্ত পরিবর্তন করুন।</p>
            <button className="btn-secondary-hero" style={{ marginTop: '16px' }} onClick={resetFilters}>
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <>
            <div className="initiatives-grid">
              {initiatives.slice(0, displayLimit).map(item => (
                <div
                  key={item.id}
                  className="init-card glass-panel"
                  onClick={() => setActiveModalInit(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActiveModalInit(item)}
                >
                  <div className="init-card-top">
                    <span className="init-code-pill">{item.code}</span>
                    <div className="init-card-badges">
                      {statusBadge(item.status)}
                      {priorityBadge(item.priority)}
                    </div>
                  </div>
                  <div className="init-pillar-label">{item.pillar_name}</div>
                  <h3 className="init-title">{item.title}</h3>
                  <p className="init-desc">{item.short_desc}</p>
                  <div className="init-card-footer">
                    <div className="init-target-year">📅 লক্ষ্য: <strong>{item.target_year}</strong></div>
                    <div className="init-actions">
                      <button
                        type="button"
                        className={`vote-btn ${votedIds.has(item.id) ? 'voted' : ''}`}
                        onClick={e => handleVote(e, item.id, item.code)}
                        title="সমর্থন করুন"
                      >
                        {votedIds.has(item.id) ? '❤️' : '🤍'} {item.votes}
                      </button>
                      <button
                        type="button"
                        className="details-arrow-btn"
                        onClick={e => { e.stopPropagation(); setActiveModalInit(item); }}
                      >
                        বিস্তারিত →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Load More Controls */}
            {initiatives.length > displayLimit && (
              <div style={{ textAlign: 'center', marginTop: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-outline-cyan"
                  onClick={() => setDisplayLimit(prev => prev + 24)}
                  style={{ padding: '12px 28px', fontSize: '0.98rem', fontWeight: 700 }}
                >
                  ⏬ আরও ২৪টি উদ্যোগ দেখুন (অবশিষ্ট {initiatives.length - displayLimit}টি)
                </button>
                <button
                  type="button"
                  className="btn-outline-cyan"
                  onClick={() => setDisplayLimit(initiatives.length)}
                  style={{ padding: '12px 24px', fontSize: '0.92rem' }}
                >
                  🌐 সবগুলো {initiatives.length}টি উদ্যোগ এক নজরে দেখুন
                </button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {activeModalInit && (
          <div className="modal-backdrop" onClick={() => setActiveModalInit(null)}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="init-code-pill">{activeModalInit.code}</span>
                    <span className="pillar-tag">{activeModalInit.pillar_name}</span>
                  </div>
                  <h2 className="modal-title">{activeModalInit.title}</h2>
                </div>
                <button type="button" className="modal-close-btn" onClick={() => setActiveModalInit(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div className="modal-meta-grid">
                  <div className="modal-meta-item">
                    <span className="meta-lbl">বর্তমান স্ট্যাটাস</span>
                    <div style={{ marginTop: '6px' }}>{statusBadge(activeModalInit.status)}</div>
                  </div>
                  <div className="modal-meta-item">
                    <span className="meta-lbl">অগ্রাধিকার</span>
                    <div style={{ marginTop: '6px' }}>{priorityBadge(activeModalInit.priority)}</div>
                  </div>
                  <div className="modal-meta-item">
                    <span className="meta-lbl">লক্ষ্য বছর</span>
                    <strong style={{ display: 'block', marginTop: '6px', color: '#38bdf8', fontSize: '1.1rem' }}>
                      {activeModalInit.target_year}
                    </strong>
                  </div>
                  <div className="modal-meta-item">
                    <span className="meta-lbl">জনসমর্থন</span>
                    <strong style={{ display: 'block', marginTop: '6px', color: '#fbbf24', fontSize: '1.1rem' }}>
                      ❤️ {activeModalInit.votes} জন
                    </strong>
                  </div>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-section-title">📌 সারসংক্ষেপ</h4>
                  <p className="modal-text">{activeModalInit.short_desc}</p>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-section-title">🗺️ পূর্ণাঙ্গ কর্মপরিকল্পনা ও কৌশলগত লক্ষ্য</h4>
                  <p className="modal-text">{activeModalInit.full_desc}</p>
                </div>

                <div className="modal-callout">
                  <h4 className="callout-title">💡 কীভাবে অংশ নেবেন?</h4>
                  <p className="callout-desc">
                    এই উদ্যোগটি ওপেন-সোর্স কমিউনিটির অধীনে পরিচালিত হচ্ছে।
                    কোড কন্ট্রিবিউশন, গবেষণা বা ডাটা দিয়ে যুক্ত হতে আইডিয়া বোর্ডে আলোচনা শুরু করুন।
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className={votedIds.has(activeModalInit.id) ? 'btn-secondary-hero' : 'btn-neon-green'}
                  style={{ padding: '10px 22px' }}
                  onClick={e => handleVote(e, activeModalInit.id, activeModalInit.code)}
                >
                  {votedIds.has(activeModalInit.id) ? '✓ ইতিমধ্যে সমর্থিত' : `❤️ সমর্থন দিন (${activeModalInit.votes})`}
                </button>
                <button
                  type="button"
                  className="btn-secondary-hero"
                  style={{ padding: '10px 22px' }}
                  onClick={() => setActiveModalInit(null)}
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Propose Initiative Modal */}
        {showSubmitModal && (
          <div className="modal-backdrop" onClick={() => setShowSubmitModal(false)}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">নতুন কৌশলগত উদ্যোগ প্রস্তাব করুন</h2>
                  <p className="modal-subtitle">বাংলার বিকাশে আপনার পরিকল্পনা যুক্ত করুন (উদ্যোগ #১০১+)</p>
                </div>
                <button type="button" className="modal-close-btn" onClick={() => setShowSubmitModal(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmitInitiative} className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>উদ্যোগের শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: উন্মুক্ত বাংলা আইটি টিউটোরিয়াল হাব"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label>মূল স্তম্ভ *</label>
                      <select
                        value={formData.pillar_id}
                        onChange={e => setFormData({ ...formData, pillar_id: e.target.value })}
                        className="form-input"
                      >
                        {PILLARS.filter(p => p.id !== 'all').map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>লক্ষ্য বছর</label>
                      <input
                        type="text"
                        placeholder="যেমন: ২০২৭"
                        value={formData.target_year}
                        onChange={e => setFormData({ ...formData, target_year: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>সংক্ষিপ্ত বিবরণ *</label>
                    <input
                      type="text"
                      required
                      placeholder="উদ্যোগটির মূল কাজ ও উদ্দেশ্য কী..."
                      value={formData.short_desc}
                      onChange={e => setFormData({ ...formData, short_desc: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>পূর্ণাঙ্গ কর্মপরিকল্পনা</label>
                    <textarea
                      rows={4}
                      placeholder="কীভাবে বাস্তবায়িত হবে, প্রযুক্তি স্ট্যাক ও দীর্ঘমেয়াদী প্রভাব..."
                      value={formData.full_desc}
                      onChange={e => setFormData({ ...formData, full_desc: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="modal-footer" style={{ padding: '0', background: 'none', border: 'none', marginTop: '4px' }}>
                    <button type="submit" className="btn-neon-green" style={{ padding: '11px 24px' }} disabled={submitting}>
                      {submitting ? 'সংরক্ষণ হচ্ছে...' : 'উদ্যোগ সাবমিট করুন'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary-hero"
                      style={{ padding: '11px 24px' }}
                      onClick={() => setShowSubmitModal(false)}
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
