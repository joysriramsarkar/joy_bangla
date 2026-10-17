// ==========================================================================
// গ্লোবাল বাংলা প্ল্যাটফর্ম (Global Bangla Main Controller)
// Full-stack REST client, dynamic UI, sound synthesis & state management
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Submodules
  window.scienceLab = new ScienceLab('scienceCanvas');
  window.voiceRecorder = new VoiceRecorderHub();
  window.litReader = new LiteratureReader();

  // Initialize UI features
  initFloatingBackground();
  initTabNavigation();
  initStats();
  initTokenizer();
  initDictionary();
  initGlossary();
  initLiterature();
  initPledges();
  initIdeas();
});

// ── Floating Background Bengali Characters ────────────────────────
function initFloatingBackground() {
  const container = document.getElementById('floatingBg');
  if (!container) return;
  const chars = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ক', 'খ', 'গ', 'ঘ', 'ড়', 'ঢ়', 'ৎ', 'ং', 'ঃ', 'ঁ', 'জ্ঞ', 'ক্ষ'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'float-char';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = `${Math.random() * 96}%`;
    span.style.fontSize = `${Math.random() * 3 + 2.5}rem`;
    span.style.animationDuration = `${Math.random() * 20 + 16}s`;
    span.style.animationDelay = `${Math.random() * 12}s`;
    container.appendChild(span);
  }
}

// ── Tab Navigation ────────────────────────────────────────────────
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.main-tab-btn');
  const panels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (!target) return;
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // If switched to science lab, trigger canvas redraw
      if (target === 'panelScience' && window.scienceLab) {
        window.scienceLab.resizeCanvas();
      }
      if (target === 'panelVoice' && window.voiceRecorder) {
        window.voiceRecorder.drawIdleVisualizer();
      }
    });
  });
}

// ── Global Stats Counter ──────────────────────────────────────────
async function initStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success && data.data) {
      const s = data.data;
      animateCounter('statPledges', s.pledges);
      animateCounter('statIdeas', s.ideas);
      animateCounter('statGlossary', s.glossary_terms);
      animateCounter('statVoice', s.voice_contributions);
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

function animateCounter(id, target) {
  const elem = document.getElementById(id);
  if (!elem) return;
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    elem.textContent = count.toLocaleString('bn-BD');
  }, 35);
}

// ── Tokenizer Lab ─────────────────────────────────────────────────
function initTokenizer() {
  const btnRun = document.getElementById('btnRunTokenizer');
  const input = document.getElementById('tokenizerInput');
  const chipsLegacy = document.getElementById('chipsLegacy');
  const chipsSmart = document.getElementById('chipsSmart');
  const countLegacy = document.getElementById('countLegacy');
  const countSmart = document.getElementById('countSmart');
  const efficiencyBadge = document.getElementById('efficiencyBadge');

  const presetBtns = document.querySelectorAll('.tok-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (input) {
        input.value = btn.dataset.text;
        runTokenizer();
      }
    });
  });

  if (btnRun) {
    btnRun.addEventListener('click', runTokenizer);
  }

  async function runTokenizer() {
    const text = input ? input.value.trim() : '';
    if (!text) return;

    try {
      const res = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;

        // Render Smart Tokens
        if (chipsSmart) {
          chipsSmart.innerHTML = d.smart_tokens.map(t => `<span class="tok-chip smart">${t}</span>`).join('');
        }
        if (countSmart) countSmart.textContent = `${d.smart_token_count} টোকেন`;

        // Render Legacy Tokens
        if (chipsLegacy) {
          chipsLegacy.innerHTML = d.legacy_tokens_sample.map(c => `<span class="tok-chip legacy">${c === ' ' ? '␣' : c}</span>`).join('');
        }
        if (countLegacy) countLegacy.textContent = `${d.legacy_char_count} অক্ষর/বাইট`;

        if (efficiencyBadge) {
          efficiencyBadge.textContent = `${d.efficiency_gain_percent}% সাশ্রয় (Efficiency Gain)`;
        }
      }
    } catch (err) {
      console.error('Tokenizer failed', err);
    }
  }

  // Initial Run
  runTokenizer();
}

// ── Dictionary Search ─────────────────────────────────────────────
function initDictionary() {
  const input = document.getElementById('dictSearchInput');
  const resultsContainer = document.getElementById('dictResults');
  let debounceTimer = null;

  if (input) {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchDictionary(input.value.trim());
      }, 300);
    });
  }

  async function searchDictionary(query) {
    try {
      const url = query ? `/api/dictionary?q=${encodeURIComponent(query)}` : '/api/dictionary';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && resultsContainer) {
        renderDictionary(data.data);
      }
    } catch (err) {
      console.error('Dictionary search failed', err);
    }
  }

  function renderDictionary(words) {
    if (!words || words.length === 0) {
      resultsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 24px;">কোনো শব্দ খুঁজে পাওয়া যায়নি।</div>`;
      return;
    }

    resultsContainer.innerHTML = words.map(w => `
      <div class="pledge-card" style="border-left: 4px solid var(--green-neon);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff;">${w.word}</h3>
          <span style="font-size: 0.82rem; color: var(--gold-antique); font-weight: 700;">${w.pos}</span>
        </div>
        <div style="font-size: 0.85rem; color: #6ee7b7; font-family: 'Inter', sans-serif; margin-bottom: 10px;">/${w.transliteration}/ • ${w.etymology}</div>
        <p style="font-size: 0.95rem; color: #e2e8f0; line-height: 1.6; margin-bottom: 8px;"><b>বাংলা অর্থ:</b> ${w.meaning_bn}</p>
        <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin-bottom: 12px;"><b>English:</b> ${w.meaning_en}</p>
        <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 6px; font-size: 0.88rem; color: #cbd5e1; border-left: 2px solid var(--gold-antique);">
          <b>উদাহরণ:</b> "${w.example_bn}"
        </div>
      </div>
    `).join('');
  }

  searchDictionary('');
}

// ── Tech & Science Glossary ───────────────────────────────────────
function initGlossary() {
  const searchInput = document.getElementById('glossarySearchInput');
  const catFilter = document.getElementById('glossaryCategoryFilter');
  const container = document.getElementById('glossaryResults');
  const formNewTerm = document.getElementById('formNewTerm');
  let debounceTimer = null;

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchGlossary, 300);
    });
  }

  if (catFilter) {
    catFilter.addEventListener('change', fetchGlossary);
  }

  if (formNewTerm) {
    formNewTerm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const term_en = document.getElementById('termEn').value.trim();
      const term_bn = document.getElementById('termBn').value.trim();
      const phonetic = document.getElementById('termPhonetic').value.trim();
      const category = document.getElementById('termCategory').value;
      const definition = document.getElementById('termDef').value.trim();
      const example = document.getElementById('termEx').value.trim();

      if (!term_en || !term_bn || !definition) {
        showToast('ইংরেজি শব্দ, বাংলা পরিভাষা ও সংজ্ঞা আবশ্যক!', 'error');
        return;
      }

      try {
        const res = await fetch('/api/glossary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ term_en, term_bn, phonetic, category, definition, example })
        });
        const data = await res.json();
        if (data.success) {
          showToast('নতুন প্রযুক্তি পরিভাষা সফলভাবে প্রস্তাবিত হয়েছে!', 'success');
          formNewTerm.reset();
          fetchGlossary();
        } else {
          showToast(data.error || 'সংরক্ষণে ব্যর্থ হয়েছে।', 'error');
        }
      } catch (err) {
        console.error('Submit term failed', err);
      }
    });
  }

  async function fetchGlossary() {
    const q = searchInput ? searchInput.value.trim() : '';
    const cat = catFilter ? catFilter.value : 'all';
    try {
      const res = await fetch(`/api/glossary?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      if (data.success && container) {
        renderGlossary(data.data);
      }
    } catch (err) {
      console.error('Glossary load error', err);
    }
  }

  function renderGlossary(terms) {
    if (!terms || terms.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 24px;">কোনো পরিভাষা পাওয়া যায়নি।</div>`;
      return;
    }

    container.innerHTML = terms.map(t => `
      <div class="pledge-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="tok-badge" style="background: rgba(139,92,246,0.15); color: #c4b5fd;">${t.category}</span>
            <button class="tok-preset-btn" onclick="window.voteGlossary(${t.id}, this)">
              ▲ সমর্থন (${t.votes})
            </button>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 4px;">${t.term_bn}</h3>
          <div style="font-size: 0.88rem; color: var(--gold-antique); font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 12px;">
            ${t.term_en} ${t.phonetic ? `• [${t.phonetic}]` : ''}
          </div>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 12px;">${t.definition}</p>
        </div>
        ${t.example ? `
          <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; font-size: 0.84rem; color: #94a3b8; border-left: 2px solid var(--green-neon);">
            <b>প্রয়োগ:</b> ${t.example}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  fetchGlossary();
}

window.voteGlossary = async function(id, btn) {
  try {
    const res = await fetch(`/api/glossary/${id}/vote`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      btn.textContent = `▲ সমর্থন (${data.data.votes})`;
      btn.style.borderColor = '#00e599';
      btn.style.color = '#00e599';
      playChime(660);
      showToast('সমর্থন ভোট সফলভাবে যুক্ত হয়েছে!', 'success');
    }
  } catch (err) {
    console.error('Vote glossary error', err);
  }
};

// ── Literature Explorer ───────────────────────────────────────────
async function initLiterature() {
  const container = document.getElementById('literatureGrid');
  try {
    const res = await fetch('/api/literature');
    const data = await res.json();
    if (data.success && container) {
      container.innerHTML = data.data.map(item => `
        <div class="lit-card" onclick="window.litReader.openBook(${item.id})">
          <div class="lit-badge">${item.genre}</div>
          <h3 class="lit-title">${item.title}</h3>
          <div class="lit-author">${item.author} • ${item.era}</div>
          <p class="lit-excerpt">"${item.excerpt}"</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; font-size: 0.84rem; color: var(--gold-antique);">
            <span>📖 সম্পূর্ণ পড়ুন (${item.read_time})</span>
            <span>➔</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Literature load error', err);
  }
}

// ── Pledges (অঙ্গীকার ওয়াল) ─────────────────────────────────────────
function initPledges() {
  const form = document.getElementById('formPledge');
  const container = document.getElementById('pledgeWallGrid');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('pledgeName').value.trim();
      const country = document.getElementById('pledgeCountry').value.trim();
      const role = document.getElementById('pledgeRole').value.trim();
      const commitment = document.getElementById('pledgeCommitment').value.trim();

      if (!name || !commitment) {
        showToast('অনুগ্রহ করে নাম ও অঙ্গীকার পূরণ করুন!', 'error');
        return;
      }

      try {
        const res = await fetch('/api/pledges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, country, role, commitment })
        });
        const data = await res.json();
        if (data.success) {
          showToast('ধন্যবাদ! আপনার অঙ্গীকার গ্লোবাল বাংলা ওয়ালে যুক্ত হয়েছে।', 'success');
          form.reset();
          playChime(520);
          loadPledges();
          initStats();
        }
      } catch (err) {
        console.error('Pledge submit error', err);
      }
    });
  }

  async function loadPledges() {
    try {
      const res = await fetch('/api/pledges');
      const data = await res.json();
      if (data.success && container) {
        container.innerHTML = data.data.map(p => `
          <div class="pledge-card">
            <div class="pledge-header">
              <span class="pledge-name">${p.name}</span>
              <span class="pledge-country">${p.country}</span>
            </div>
            <div class="pledge-role">${p.role}</div>
            <p class="pledge-body">"${p.commitment}"</p>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load pledges', err);
    }
  }

  loadPledges();
}

// ── Ideas Board (আইডিয়া ও ভোটিং) ──────────────────────────────────
function initIdeas() {
  const form = document.getElementById('formIdea');
  const container = document.getElementById('ideasGrid');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('ideaTitle').value.trim();
      const author = document.getElementById('ideaAuthor').value.trim();
      const country = document.getElementById('ideaCountry').value.trim();
      const category = document.getElementById('ideaCategory').value;
      const description = document.getElementById('ideaDesc').value.trim();

      if (!title || !description) {
        showToast('শিরোনাম ও বিবরণ আবশ্যক!', 'error');
        return;
      }

      try {
        const res = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, author, country, category, description })
        });
        const data = await res.json();
        if (data.success) {
          showToast('আপনার চমৎকার আইডিয়াটি সাবমিট হয়েছে!', 'success');
          form.reset();
          playChime(580);
          loadIdeas();
          initStats();
        }
      } catch (err) {
        console.error('Idea submit error', err);
      }
    });
  }

  async function loadIdeas() {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      if (data.success && container) {
        container.innerHTML = data.data.map(i => `
          <div class="pledge-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span class="tok-badge" style="background: rgba(0,229,153,0.15); color: var(--green-neon);">${i.category}</span>
                <button class="tok-preset-btn" onclick="window.voteIdea(${i.id}, this)">
                  ▲ ভোট (${i.votes})
                </button>
              </div>
              <h3 style="font-size: 1.18rem; font-weight: 800; color: #fff; margin-bottom: 6px;">${i.title}</h3>
              <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 12px;">${i.description}</p>
            </div>
            <div style="font-size: 0.8rem; color: #9ca3af; border-top: 1px solid var(--border); padding-top: 8px;">
              প্রস্তাবক: <b style="color: #cbd5e1;">${i.author}</b> (${i.country})
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load ideas', err);
    }
  }

  loadIdeas();
}

window.voteIdea = async function(id, btn) {
  try {
    const res = await fetch(`/api/ideas/${id}/vote`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      btn.textContent = `▲ ভোট (${data.data.votes})`;
      btn.style.borderColor = '#00e599';
      btn.style.color = '#00e599';
      playChime(660);
      showToast('ভোট সফলভাবে গণনা করা হয়েছে!', 'success');
    }
  } catch (err) {
    console.error('Vote error', err);
  }
};

// ── Toast Notification & Sound Synthesis ──────────────────────────
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.showToast = showToast;

function playChime(freq = 520) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Ignore audio permission restrictions
  }
}
