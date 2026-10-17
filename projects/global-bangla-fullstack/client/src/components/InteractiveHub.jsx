import React, { useState } from 'react';
import TokenizerLab from './TokenizerLab';
import ScienceLab from './ScienceLab';
import VoiceRecorder from './VoiceRecorder';
import DictionarySearch from './DictionarySearch';
import TechGlossary from './TechGlossary';

export default function InteractiveHub({ onToast }) {
  const [activeTab, setActiveTab] = useState('tokenizer');

  const tabs = [
    { id: 'tokenizer', label: 'এআই টোকেনায়ন ল্যাব', icon: '🔤' },
    { id: 'science', label: 'ভার্চুয়াল সায়েন্স ল্যাব', icon: '⚛️' },
    { id: 'voice', label: 'কমন ভয়েস রেকর্ডার', icon: '🎙️' },
    { id: 'dict', label: 'উন্মুক্ত বাংলা অভিধান', icon: '📖' },
    { id: 'glossary', label: 'প্রযুক্তি পরিভাষাকোষ', icon: '💻' },
  ];

  return (
    <section className="section interactive-hub" id="interactiveHub">
      <div className="container">
        <div className="section-head">
          <span className="pill-badge pill-emerald">সরাসরি ইন্টারঅ্যাকশন</span>
          <h2 className="section-title">উদ্ভাবনী ডিজিটাল ল্যাব ও টুলস হাব</h2>
          <p className="section-desc">
            নীচের ট্যাবগুলো ক্লিক করে সরাসরি ব্রাউজারেই এআই টোকেনায়ন, ভার্চুয়াল পদার্থবিজ্ঞান ল্যাব, অডিও ভয়েস ডোনেশন ও শব্দভাণ্ডার পরখ করুন।
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-nav" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
          {activeTab === 'tokenizer' && <TokenizerLab />}
          {activeTab === 'science' && <ScienceLab />}
          {activeTab === 'voice' && <VoiceRecorder onToast={onToast} />}
          {activeTab === 'dict' && <DictionarySearch />}
          {activeTab === 'glossary' && <TechGlossary onToast={onToast} />}
        </div>
      </div>
    </section>
  );
}
