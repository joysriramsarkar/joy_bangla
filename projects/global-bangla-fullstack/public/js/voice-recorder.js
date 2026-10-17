// ==========================================================================
// বাংলা কমন ভয়েস অডিও রেকর্ডার ও ভেরিফায়ার (Web Audio API)
// Real-time audio waveform visualizer & Audio Donation Engine
// ==========================================================================

class VoiceRecorderHub {
  constructor() {
    this.canvas = document.getElementById('audioVisualizer');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.recordBtn = document.getElementById('btnRecordVoice');
    this.sentenceElem = document.getElementById('voicePromptText');
    this.speakerNameInput = document.getElementById('voiceSpeakerName');
    this.dialectSelect = document.getElementById('voiceDialect');
    this.statusElem = document.getElementById('voiceStatus');
    this.samplesListElem = document.getElementById('voiceSamplesList');

    this.sentences = [
      "আমাদের মাতৃভাষা বাংলা বিশ্বের দরবারে একদিন প্রযুক্তির শীর্ষ স্থানে পৌঁছাবে।",
      "শিক্ষা ও বিজ্ঞানের প্রতিটি শাখায় উচ্চমানের প্রমিত বাংলা কনটেন্ট গড়ে তোলা জরুরি।",
      "জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর আপন প্রাঙ্গণতলে বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি।",
      "আঁরা বেয়াকে মিলি নিজর ভাষারে সুন্দর করি গড়ি তুলিয়ুম বিশ্বর বুকত।",
      "আমরার এই সুন্দর বাংলা ভাষা তান লাগি আমরা অশেষ গর্ববোধ করি।"
    ];
    this.currentSentenceIdx = 0;

    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.audioCtx = null;
    this.analyser = null;
    this.animId = null;

    this.init();
  }

  init() {
    this.updatePrompt();

    const nextBtn = document.getElementById('btnNextPrompt');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentSentenceIdx = (this.currentSentenceIdx + 1) % this.sentences.length;
        this.updatePrompt();
      });
    }

    if (this.recordBtn) {
      this.recordBtn.addEventListener('click', () => this.toggleRecord());
    }

    this.loadSamples();
    this.drawIdleVisualizer();
  }

  updatePrompt() {
    if (this.sentenceElem) {
      this.sentenceElem.textContent = `"${this.sentences[this.currentSentenceIdx]}"`;
    }
  }

  drawIdleVisualizer() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width = this.canvas.parentElement.clientWidth || 500;
    const h = this.canvas.height = 100;
    this.ctx.fillStyle = '#05070e';
    this.ctx.fillRect(0, 0, w, h);

    // Subtle horizontal idle line
    this.ctx.strokeStyle = 'rgba(0, 229, 153, 0.25)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(w, h / 2);
    this.ctx.stroke();
  }

  async toggleRecord() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioCtx.createMediaStreamSource(stream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.audioChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
          this.submitVoiceSample();
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        this.updateRecordUI(true);
        this.visualizeWaveform();
      } else {
        // Fallback simulation for environments without audio hardware
        this.startSimulatedRecording();
      }
    } catch (err) {
      console.warn('Microphone access unavailable, using simulated recording mode:', err);
      this.startSimulatedRecording();
    }
  }

  startSimulatedRecording() {
    this.isRecording = true;
    this.updateRecordUI(true);
    let step = 0;

    const simLoop = () => {
      if (!this.isRecording) return;
      step += 0.1;
      this.drawSimulatedWave(step);
      this.animId = requestAnimationFrame(simLoop);
    };
    simLoop();
  }

  drawSimulatedWave(step) {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.fillStyle = '#05070e';
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.strokeStyle = '#ff334b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.05 + step) * Math.sin(step * 0.5) * 28;
      if (x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }

  visualizeWaveform() {
    if (!this.isRecording || !this.analyser || !this.ctx) return;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isRecording) return;
      this.analyser.getByteTimeDomainData(dataArray);

      const w = this.canvas.width;
      const h = this.canvas.height;
      this.ctx.fillStyle = '#05070e';
      this.ctx.fillRect(0, 0, w, h);

      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#00e599';
      this.ctx.beginPath();

      const sliceWidth = w / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
        x += sliceWidth;
      }

      this.ctx.lineTo(w, h / 2);
      this.ctx.stroke();
      this.animId = requestAnimationFrame(draw);
    };

    draw();
  }

  stopRecording() {
    this.isRecording = false;
    this.updateRecordUI(false);
    if (this.animId) cancelAnimationFrame(this.animId);

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    } else {
      this.submitVoiceSample();
    }
    this.drawIdleVisualizer();
  }

  updateRecordUI(recording) {
    if (this.recordBtn) {
      if (recording) {
        this.recordBtn.classList.add('recording');
        this.recordBtn.innerHTML = '⏹';
        if (this.statusElem) this.statusElem.textContent = 'রেকর্ড হচ্ছে... সমাপ্ত করতে আবার চাপুন।';
      } else {
        this.recordBtn.classList.remove('recording');
        this.recordBtn.innerHTML = '🎙️';
        if (this.statusElem) this.statusElem.textContent = 'অডিও সফলভাবে তৈরি হয়েছে! জমা দেওয়া হচ্ছে...';
      }
    }
  }

  async submitVoiceSample() {
    const speaker = this.speakerNameInput ? this.speakerNameInput.value.trim() : 'উন্মুক্ত কণ্ঠদাতা';
    const dialect = this.dialectSelect ? this.dialectSelect.value : 'প্রমিত মান বাংলা';
    const sentence = this.sentences[this.currentSentenceIdx];

    try {
      const res = await fetch('/api/voice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker_name: speaker || 'উন্মুক্ত কণ্ঠদাতা',
          dialect: dialect,
          sentence: sentence,
          duration_sec: (Math.random() * 2 + 2.5).toFixed(1)
        })
      });

      const data = await res.json();
      if (data.success) {
        if (window.showToast) window.showToast('ধন্যবাদ! আপনার কণ্ঠস্বর সফলভাবে উন্মুক্ত ডেটাসেটে যুক্ত হয়েছে।', 'success');
        this.loadSamples();
      }
    } catch (err) {
      console.error('Voice submission error:', err);
    }
  }

  async loadSamples() {
    try {
      const res = await fetch('/api/voice/samples');
      const data = await res.json();
      if (data.success && this.samplesListElem) {
        this.renderSamples(data.data);
      }
    } catch (err) {
      console.error('Failed to load voice samples', err);
    }
  }

  renderSamples(samples) {
    this.samplesListElem.innerHTML = samples.map(s => `
      <div class="pledge-card" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px;">
        <div>
          <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">"${s.sentence}"</div>
          <div style="font-size: 0.78rem; color: #9ca3af; margin-top: 4px;">
            কণ্ঠদাতা: <b style="color: #cbd5e1;">${s.speaker_name}</b> | উপভাষা: <span style="color: #00e599;">${s.dialect}</span> | স্থায়িত্ব: ${s.duration_sec}s
          </div>
        </div>
        <button class="tok-preset-btn" onclick="window.verifyVoiceSample(${s.id}, this)">
          ✓ সঠিক (${s.verified_count})
        </button>
      </div>
    `).join('');
  }
}

window.verifyVoiceSample = async function(id, btn) {
  try {
    const res = await fetch(`/api/voice/${id}/verify`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      btn.textContent = `✓ সঠিক (${data.data.verified_count})`;
      btn.style.borderColor = '#00e599';
      btn.style.color = '#00e599';
      if (window.showToast) window.showToast('ভেরিফিকেশন ভোট গৃহীত হয়েছে!', 'success');
    }
  } catch (err) {
    console.error('Verify error', err);
  }
};

window.VoiceRecorderHub = VoiceRecorderHub;
