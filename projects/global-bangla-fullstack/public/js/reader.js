// ==========================================================================
// ডিজিটাল সাহিত্যাগার রিডার (Digital Classics Reader Modal)
// ==========================================================================

class LiteratureReader {
  constructor() {
    this.modal = document.getElementById('readerModal');
    this.titleElem = document.getElementById('readerTitle');
    this.authorElem = document.getElementById('readerAuthor');
    this.eraElem = document.getElementById('readerEra');
    this.bodyElem = document.getElementById('readerBody');
    this.closeBtn = document.getElementById('readerCloseBtn');
    this.currentFontSize = 18;

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Font size controls
    const btnFontPlus = document.getElementById('btnFontPlus');
    const btnFontMinus = document.getElementById('btnFontMinus');

    if (btnFontPlus) {
      btnFontPlus.addEventListener('click', () => {
        if (this.currentFontSize < 28) {
          this.currentFontSize += 2;
          if (this.bodyElem) this.bodyElem.style.fontSize = `${this.currentFontSize}px`;
        }
      });
    }

    if (btnFontMinus) {
      btnFontMinus.addEventListener('click', () => {
        if (this.currentFontSize > 14) {
          this.currentFontSize -= 2;
          if (this.bodyElem) this.bodyElem.style.fontSize = `${this.currentFontSize}px`;
        }
      });
    }
  }

  async openBook(id) {
    try {
      const res = await fetch(`/api/literature/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        const isPoetry =
          item.genre?.includes('কবিতা') ||
          item.genre?.includes('কাব্য') ||
          (item.full_text && item.full_text.split('\n').length > 6);

        if (this.bodyElem) {
          const toBn = (n) => String(n).replace(/[0-9]/g, (d) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][d]);
          const stanzas = item.full_text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);

          if (isPoetry) {
            let html = `
              <div class="poem-container">
                <div class="poem-ornament-top">
                  <span class="ornament-line"></span>
                  <span class="ornament-star">✦ ✦ ✦</span>
                  <span class="ornament-line"></span>
                </div>
            `;

            stanzas.forEach((stanza, sIdx) => {
              const lines = stanza.split('\n').filter(l => l.trim().length > 0);
              html += `
                <div class="poem-stanza">
                  <div class="stanza-tag">
                    <span class="stanza-tag-text">স্তবক ${toBn(sIdx + 1)}</span>
                  </div>
                  <div class="stanza-verses">
              `;

              lines.forEach(line => {
                const trimmed = line.trim();
                const isRefrain =
                  trimmed.startsWith('বল বীর') ||
                  trimmed.startsWith('আমি চির-উন্নত') ||
                  trimmed.startsWith('মহা-বিদ্রোহী') ||
                  trimmed.startsWith('বিদ্রোহী রণ-ক্লান্ত') ||
                  trimmed.startsWith('কাণ্ডারী!') ||
                  trimmed.endsWith('—');

                html += `<div class="poem-line ${isRefrain ? 'poem-line-refrain' : ''}"><span class="poem-line-text">${trimmed}</span></div>`;
              });

              html += `
                  </div>
                </div>
              `;
            });

            html += `
                <div class="poem-ornament-bottom">
                  <span class="ornament-line"></span>
                  <div class="poem-ending-badge">
                    <span class="ending-floral">❦</span>
                    <span class="ending-text">সমাপ্ত</span>
                    <span class="ending-floral">❦</span>
                  </div>
                  <span class="ornament-line"></span>
                </div>
              </div>
            `;
            this.bodyElem.innerHTML = html;
          } else {
            let html = '<div class="prose-container">';
            stanzas.forEach(p => {
              html += `<p class="prose-paragraph">${p}</p>`;
            });
            html += `
                <div class="poem-ornament-bottom">
                  <span class="ornament-line"></span>
                  <div class="poem-ending-badge">
                    <span class="ending-floral">❦</span>
                    <span class="ending-text">সমাপ্ত</span>
                    <span class="ending-floral">❦</span>
                  </div>
                  <span class="ornament-line"></span>
                </div>
              </div>
            `;
            this.bodyElem.innerHTML = html;
          }
        }

        if (this.modal) this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    } catch (err) {
      console.error('Failed to load literature item', err);
    }
  }

  close() {
    if (this.modal) this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.LiteratureReader = LiteratureReader;
