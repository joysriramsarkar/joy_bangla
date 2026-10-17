import React from 'react';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="nav-brand">
          <Logo size={42} />
          <div className="nav-brand-text">
            <h1>জয় বাংলা</h1>
            <span>গ্লোবাল বাংলা প্ল্যাটফর্ম</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#pillars" className="nav-link">কৌশলগত স্তম্ভ</a></li>
          <li><a href="#initiatives" className="nav-link">৬০০ উদ্যোগ</a></li>
          <li><a href="#interactiveHub" className="nav-link">ল্যাব ও টুলস</a></li>
          <li><a href="#literature" className="nav-link">সাহিত্যাগার</a></li>
          <li><a href="#pledges" className="nav-link">অঙ্গীকার</a></li>
          <li><a href="#ideas" className="nav-link">আইডিয়া বোর্ড</a></li>
          <li>
            <a href="#pledges" className="btn-pledge-nav">
              <span>✍️</span> অঙ্গীকার করুন
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
