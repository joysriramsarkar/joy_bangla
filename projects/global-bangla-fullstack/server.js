const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { db, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database
initDatabase();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve React production build if available, else public
const clientDistPath = path.join(__dirname, 'client', 'dist');
const fs = require('node:fs');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

// ── API: Global Stats ──────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const pledgesCount = db.prepare('SELECT COUNT(*) as count FROM pledges').get().count;
    const ideasCount = db.prepare('SELECT COUNT(*) as count FROM ideas').get().count;
    const glossaryCount = db.prepare('SELECT COUNT(*) as count FROM glossary').get().count;
    const litCount = db.prepare('SELECT COUNT(*) as count FROM literature').get().count;
    const voiceCount = db.prepare('SELECT COUNT(*) as count FROM voice_samples').get().count;
    const dictCount = db.prepare('SELECT COUNT(*) as count FROM dictionary').get().count;
    const initiativesCount = db.prepare('SELECT COUNT(*) as count FROM initiatives').get().count;

    const countries = db.prepare(`
      SELECT country, COUNT(*) as count 
      FROM pledges 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 8
    `).all();

    res.json({
      success: true,
      data: {
        speakers: "৩০ কোটি+",
        web_content_current: "০.১%",
        target_2040: "৫.০%+",
        pledges: pledgesCount,
        ideas: ideasCount,
        glossary_terms: glossaryCount,
        literature_works: litCount,
        voice_contributions: voiceCount,
        dictionary_words: dictCount,
        initiatives_count: initiativesCount,
        top_countries: countries
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Pledges (অঙ্গীকার) ──────────────────────────────────────
app.get('/api/pledges', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM pledges ORDER BY id DESC LIMIT 50').all();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/pledges', (req, res) => {
  try {
    const { name, country, role, commitment } = req.body;
    if (!name || !commitment) {
      return res.status(400).json({ success: false, error: 'নাম ও অঙ্গীকার আবশ্যক।' });
    }
    const stmt = db.prepare(`
      INSERT INTO pledges (name, country, role, commitment) 
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      name.trim(),
      (country || 'অন্যান্য').trim(),
      (role || 'সাধারণ শুভানুধ্যায়ী').trim(),
      commitment.trim()
    );
    const newPledge = db.prepare('SELECT * FROM pledges WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newPledge });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Ideas (আইডিয়া ও ভোটিং) ─────────────────────────────────
app.get('/api/ideas', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM ideas ORDER BY votes DESC, id DESC').all();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ideas', (req, res) => {
  try {
    const { title, author, country, category, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'শিরোনাম ও বিবরণ আবশ্যক।' });
    }
    const stmt = db.prepare(`
      INSERT INTO ideas (title, author, country, category, description, votes) 
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(
      title.trim(),
      (author || 'বেনামী শুভানুধ্যায়ী').trim(),
      (country || 'বাংলাদেশ').trim(),
      (category || 'সাধারণ').trim(),
      description.trim()
    );
    const newIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newIdea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ideas/:id/vote', (req, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('UPDATE ideas SET votes = votes + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT * FROM ideas WHERE id = ?').get(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'আইডিয়া পাওয়া যায়নি।' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Tech & Science Glossary (পরিভাষাকোষ) ────────────────────
app.get('/api/glossary', (req, res) => {
  try {
    const { q, category } = req.query;
    let query = 'SELECT * FROM glossary WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND (term_en LIKE ? OR term_bn LIKE ? OR phonetic LIKE ? OR definition LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY votes DESC, term_en ASC';
    const list = db.prepare(query).all(...params);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/glossary/:id/vote', (req, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('UPDATE glossary SET votes = votes + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT * FROM glossary WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/glossary', (req, res) => {
  try {
    const { term_en, term_bn, phonetic, category, definition, example } = req.body;
    if (!term_en || !term_bn || !definition) {
      return res.status(400).json({ success: false, error: 'ইংরেজি শব্দ, বাংলা পরিভাষা ও সংজ্ঞা আবশ্যক।' });
    }
    const stmt = db.prepare(`
      INSERT INTO glossary (term_en, term_bn, phonetic, category, definition, example, votes)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(term_en.trim(), term_bn.trim(), phonetic || '', category || 'প্রযুক্তি', definition.trim(), example || '');
    const created = db.prepare('SELECT * FROM glossary WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Dictionary (অভিধান) ───────────────────────────────────
app.get('/api/dictionary', (req, res) => {
  try {
    const { q, featured } = req.query;
    if (featured) {
      const dayWord = db.prepare('SELECT * FROM dictionary ORDER BY RANDOM() LIMIT 1').get();
      return res.json({ success: true, data: dayWord });
    }
    if (q) {
      const term = `%${q}%`;
      const matches = db.prepare(`
        SELECT * FROM dictionary 
        WHERE word LIKE ? OR transliteration LIKE ? OR meaning_bn LIKE ? OR meaning_en LIKE ?
        LIMIT 20
      `).all(term, term, term, term);
      return res.json({ success: true, data: matches });
    }
    const allWords = db.prepare('SELECT * FROM dictionary ORDER BY id ASC').all();
    res.json({ success: true, data: allWords });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Literature (সাহিত্যাগার) ────────────────────────────────
app.get('/api/literature', (req, res) => {
  try {
    const list = db.prepare('SELECT id, title, author, era, genre, excerpt, read_time, cover_color FROM literature ORDER BY id ASC').all();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/literature/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM literature WHERE id = ?').get(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, error: 'সাহিত্যকর্মটি পাওয়া যায়নি।' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Voice Samples & Common Voice (স্পিচ হাব) ───────────────
app.get('/api/voice/samples', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM voice_samples ORDER BY id DESC LIMIT 20').all();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/voice/submit', (req, res) => {
  try {
    const { speaker_name, dialect, sentence, audio_data, duration_sec } = req.body;
    if (!sentence) {
      return res.status(400).json({ success: false, error: 'বাক্যটি আবশ্যক।' });
    }
    const stmt = db.prepare(`
      INSERT INTO voice_samples (speaker_name, dialect, sentence, audio_data, duration_sec, verified_count)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(
      (speaker_name || 'উন্মুক্ত কণ্ঠদাতা').trim(),
      (dialect || 'প্রমিত মান বাংলা').trim(),
      sentence.trim(),
      audio_data || '',
      duration_sec || 3.0
    );
    const created = db.prepare('SELECT * FROM voice_samples WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/voice/:id/verify', (req, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('UPDATE voice_samples SET verified_count = verified_count + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT * FROM voice_samples WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: Tokenizer Benchmark (এআই টোকেনায়ন ল্যাব) ────────────────
app.post('/api/tokenizer', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'টেক্সট আবশ্যক।' });
    }

    // Naive / Character-level representation
    const rawChars = Array.from(text);
    const utf8Bytes = Buffer.byteLength(text, 'utf8');

    // Simulated Smart Bengali Subword / BPE Tokenizer
    // Splits by words and common suffixes, prefixes, and morphemes
    const words = text.trim().split(/\s+/);
    const smartTokens = [];

    const commonSuffixes = ['দের', 'গুলো', 'খানি', 'খানা', 'টিতে', 'টির', 'য়ের', 'কে', 'তে', 'র', 'রা', 'ছেন', 'লেন', 'ছেন'];

    for (const w of words) {
      if (w.length <= 3) {
        smartTokens.push(w);
      } else {
        let matched = false;
        for (const suffix of commonSuffixes) {
          if (w.endsWith(suffix) && w.length > suffix.length + 1) {
            const root = w.slice(0, -suffix.length);
            smartTokens.push(root, '##' + suffix);
            matched = true;
            break;
          }
        }
        if (!matched) {
          smartTokens.push(w);
        }
      }
    }

    const legacyTokensCount = rawChars.length;
    const smartTokensCount = smartTokens.length;
    const efficiency = Math.round(((legacyTokensCount - smartTokensCount) / legacyTokensCount) * 100);

    res.json({
      success: true,
      data: {
        original_text: text,
        utf8_bytes: utf8Bytes,
        legacy_char_count: legacyTokensCount,
        smart_token_count: smartTokensCount,
        efficiency_gain_percent: Math.max(0, efficiency),
        smart_tokens: smartTokens,
        legacy_tokens_sample: rawChars.slice(0, 30)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── API: 100 Strategic Initiatives (১০০টি কৌশলগত উদ্যোগ) ────────
app.get('/api/initiatives', (req, res) => {
  try {
    const { pillar, status, priority, q, sort } = req.query;
    let query = 'SELECT * FROM initiatives WHERE 1=1';
    const params = [];

    if (pillar && pillar !== 'all') {
      query += ' AND pillar_id = ?';
      params.push(pillar);
    }
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      query += ' AND (title LIKE ? OR short_desc LIKE ? OR full_desc LIKE ? OR code LIKE ? OR pillar_name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (sort === 'votes') {
      query += ' ORDER BY votes DESC, id ASC';
    } else if (sort === 'target_year') {
      query += ' ORDER BY target_year ASC, id ASC';
    } else {
      query += ' ORDER BY id ASC';
    }

    const list = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM initiatives').get().count;
    const active = db.prepare("SELECT COUNT(*) as count FROM initiatives WHERE status = 'active'").get().count;
    const inProgress = db.prepare("SELECT COUNT(*) as count FROM initiatives WHERE status = 'in_progress'").get().count;
    const planned = db.prepare("SELECT COUNT(*) as count FROM initiatives WHERE status = 'planned'").get().count;

    res.json({
      success: true,
      data: list,
      meta: {
        total,
        active,
        in_progress: inProgress,
        planned,
        filtered_count: list.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/initiatives/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'উদ্যোগ পাওয়া যায়নি।' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/initiatives/:id/vote', (req, res) => {
  try {
    const id = req.params.id;
    const item = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'উদ্যোগ পাওয়া যায়নি।' });
    }
    db.prepare('UPDATE initiatives SET votes = votes + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/initiatives', (req, res) => {
  try {
    const { title, pillar_id, pillar_name, short_desc, full_desc, target_year, priority } = req.body;
    if (!title || !short_desc || !pillar_id) {
      return res.status(400).json({ success: false, error: 'শিরোনাম, স্তম্ভ ও সারসংক্ষেপ আবশ্যক।' });
    }

    const maxIdRow = db.prepare('SELECT MAX(id) as max_id FROM initiatives').get();
    const nextNum = (maxIdRow.max_id || 100) + 1;
    const nextCode = `INIT-${String(nextNum).padStart(3, '0')}`;

    const stmt = db.prepare(`
      INSERT INTO initiatives (code, pillar_id, pillar_name, title, short_desc, full_desc, status, priority, target_year, votes)
      VALUES (?, ?, ?, ?, ?, ?, 'planned', ?, ?, 1)
    `);

    const info = stmt.run(
      nextCode,
      pillar_id,
      pillar_name || 'কমিউনিটি প্রস্তাবিত',
      title.trim(),
      short_desc.trim(),
      (full_desc || short_desc).trim(),
      priority || 'medium',
      target_year || '২০২৭'
    );

    const created = db.prepare('SELECT * FROM initiatives WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Catch-all Route: Serves index.html ──────────────────────────
app.use((req, res) => {
  const distIndex = path.join(__dirname, 'client', 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌐 জয় বাংলা — গ্লোবাল বাংলা প্ল্যাটফর্ম সার্ভার চালু হয়েছে: http://localhost:${PORT}`);
});
