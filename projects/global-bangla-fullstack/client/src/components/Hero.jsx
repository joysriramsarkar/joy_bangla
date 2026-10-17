import React from 'react';

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      <div className="hero-badge">
        <span>✨</span> বাংলা ভাষা, সাহিত্য, সংস্কৃতি ও বিজ্ঞানের বিশ্বজয়ের মহাযজ্ঞ
      </div>

      <h1 className="hero-title">
        একবিংশ শতাব্দীর প্রযুক্তি ও এআই-তে <br />
        <span className="gradient-text">বাংলা ভাষার বৈশ্বিক জাগরণ</span>
      </h1>

      <p className="hero-desc">
        বিশ্বজুড়ে ৩০+ কোটি মানুষের ভাষা বাংলাকে কেবল কথ্য ও সাহিত্যের মিউজিয়ামে না রেখে—লার্জ ল্যাঙ্গুয়েজ মডেল (LLM),
        ওপেন সায়েন্স সিমুলেশন, স্বরভাণ্ডার ও আধুনিক প্রযুক্তি পরিভাষার শীর্ষে রূপান্তর করার সমন্বিত রোডম্যাপ ও অ্যাকশন প্ল্যাটফর্ম।
      </p>

      <div className="hero-actions">
        <a href="#initiatives" className="btn-primary-hero">
          <span>🚀</span> ৬০০টি কৌশলগত উদ্যোগ
        </a>
        <a href="#interactiveHub" className="btn-secondary-hero">
          <span>⚡</span> ল্যাব ও সিমুলেটর
        </a>
        <a href="#pledges" className="btn-secondary-hero">
          <span>✍️</span> অঙ্গীকার ওয়াল
        </a>
        <a href="#literature" className="btn-secondary-hero">
          <span>📖</span> ক্লাসিক সাহিত্যাগার
        </a>
      </div>
    </header>
  );
}
