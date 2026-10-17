import React from 'react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Logo size={48} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>জয় বাংলা</h3>
              <p className="footer-text">
                বাংলা ভাষা, সাহিত্য, সংস্কৃতি ও বিজ্ঞানের বিশ্বজয়ের উন্মুক্ত প্ল্যাটফর্ম।
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a href="#pillars" className="nav-link" style={{ fontSize: '0.9rem' }}>কৌশলগত ভিত্তি</a>
            <a href="#initiatives" className="nav-link" style={{ fontSize: '0.9rem' }}>৬০০ উদ্যোগ</a>
            <a href="#interactiveHub" className="nav-link" style={{ fontSize: '0.9rem' }}>ল্যাব ও সিমুলেটর</a>
            <a href="#literature" className="nav-link" style={{ fontSize: '0.9rem' }}>সাহিত্যাগার</a>
            <a href="#pledges" className="nav-link" style={{ fontSize: '0.9rem' }}>অঙ্গীকার প্রাচীর</a>
            <a href="#ideas" className="nav-link" style={{ fontSize: '0.9rem' }}>আইডিয়া বোর্ড</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-dedication">
            পৃথিবীর সমস্ত বাঙালির জন্য তৈরি, ❤️ দিয়ে
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            উন্মুক্ত ওপেনসোর্স উদ্যোগ • কোডবেস <b>MIT License</b> এবং তথ্য ও উপাত্ত <b>CC BY-SA 4.0 / CC0</b> লাইসেন্সের অধীন।
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span>🔓 সম্পূর্ণ উন্মুক্ত সোর্স কোড</span>
            <span>📖 সার্বজনীন জ্ঞানভাণ্ডার</span>
            <span>🌐 অবাধে ব্যবহার ও রূপান্তরযোগ্য</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
