import React, { useEffect, useState } from 'react';

export default function StatsRibbon() {
  const [stats, setStats] = useState({
    speakers: '৩০ কোটি+',
    pledges: 342,
    ideas: 24,
    glossary_terms: 16,
    voice_contributions: 58,
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats(prev => ({ ...prev, ...data.data }));
        }
      })
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <section className="container" style={{ position: 'relative', zIndex: 2, marginTop: '-30px', marginBottom: '40px' }}>
      <div className="stats-ribbon">
        <div className="stat-item">
          <div className="stat-num emerald">{stats.speakers || '৩০ কোটি+'}</div>
          <div className="stat-label">বিশ্বজুড়ে মোট বাংলাভাষী</div>
        </div>

        <div className="stat-item">
          <div className="stat-num sky">{stats.initiatives_count || '১০০+'}</div>
          <div className="stat-label">বাস্তবমুখী রূপান্তর উদ্যোগ</div>
        </div>

        <div className="stat-item">
          <div className="stat-num gold">{stats.pledges}</div>
          <div className="stat-label">গ্লোবাল অঙ্গীকার জমা</div>
        </div>

        <div className="stat-item">
          <div className="stat-num crimson">{stats.ideas}</div>
          <div className="stat-label">উদ্ভাবনী প্রস্তাবনা</div>
        </div>
      </div>
    </section>
  );
}
