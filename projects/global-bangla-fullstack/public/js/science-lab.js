// ==========================================================================
// গ্লোবাল বাংলা ভার্চুয়াল সায়েন্স ল্যাব (Interactive Science Simulation)
// Real-time Canvas Physics: Simple Pendulum & Snell's Law Refraction
// ==========================================================================

class ScienceLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'pendulum'; // 'pendulum' or 'refraction'

    // Pendulum State
    this.pendulum = {
      length: 180,       // pixels
      gravity: 9.8,      // m/s^2
      mass: 15,          // kg
      damping: 0.998,
      angle: Math.PI / 4,// initial 45 degrees
      angleVelocity: 0,
      angleAcceleration: 0,
      originX: 300,
      originY: 40,
      trail: []
    };

    // Refraction State
    this.refraction = {
      n1: 1.0,           // Air
      n2: 1.33,          // Water (default)
      incidentAngleDeg: 45
    };

    // Resize canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.isRunning = true;
    this.initControls();
    this.animate();
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: 600 };
    this.canvas.width = rect.width || 600;
    this.canvas.height = 380;
    if (this.pendulum) {
      this.pendulum.originX = this.canvas.width / 2;
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.pendulum.trail = [];
    const controlsPendulum = document.getElementById('controlsPendulum');
    const controlsRefraction = document.getElementById('controlsRefraction');
    if (controlsPendulum && controlsRefraction) {
      if (mode === 'pendulum') {
        controlsPendulum.style.display = 'flex';
        controlsRefraction.style.display = 'none';
      } else {
        controlsPendulum.style.display = 'none';
        controlsRefraction.style.display = 'flex';
      }
    }
  }

  initControls() {
    // Pendulum sliders
    const lenSlider = document.getElementById('pendulumLength');
    const gravSlider = document.getElementById('pendulumGravity');
    const massSlider = document.getElementById('pendulumMass');

    if (lenSlider) {
      lenSlider.addEventListener('input', (e) => {
        this.pendulum.length = Number(e.target.value);
        document.getElementById('valLength').textContent = `${this.pendulum.length} px`;
      });
    }

    if (gravSlider) {
      gravSlider.addEventListener('input', (e) => {
        this.pendulum.gravity = Number(e.target.value);
        document.getElementById('valGravity').textContent = `${this.pendulum.gravity} m/s²`;
      });
    }

    if (massSlider) {
      massSlider.addEventListener('input', (e) => {
        this.pendulum.mass = Number(e.target.value);
        document.getElementById('valMass').textContent = `${this.pendulum.mass} kg`;
      });
    }

    // Refraction sliders
    const incSlider = document.getElementById('incidentAngle');
    const n2Select = document.getElementById('mediumSelect');

    if (incSlider) {
      incSlider.addEventListener('input', (e) => {
        this.refraction.incidentAngleDeg = Number(e.target.value);
        document.getElementById('valIncident').textContent = `${this.refraction.incidentAngleDeg}°`;
      });
    }

    if (n2Select) {
      n2Select.addEventListener('change', (e) => {
        this.refraction.n2 = Number(e.target.value);
      });
    }

    // Toggle simulation mode buttons
    const btnPendulum = document.getElementById('simTabPendulum');
    const btnRefraction = document.getElementById('simTabRefraction');

    if (btnPendulum && btnRefraction) {
      btnPendulum.addEventListener('click', () => {
        btnPendulum.classList.add('active');
        btnRefraction.classList.remove('active');
        this.setMode('pendulum');
      });
      btnRefraction.addEventListener('click', () => {
        btnRefraction.classList.add('active');
        btnPendulum.classList.remove('active');
        this.setMode('refraction');
      });
    }
  }

  animate() {
    if (this.isRunning) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.mode === 'pendulum') {
        this.updateAndDrawPendulum();
      } else {
        this.drawRefraction();
      }
    }
    requestAnimationFrame(() => this.animate());
  }

  updateAndDrawPendulum() {
    const p = this.pendulum;

    // Physics step
    const scaling = 0.05;
    p.angleAcceleration = (-1 * (p.gravity * scaling) / (p.length / 50)) * Math.sin(p.angle);
    p.angleVelocity += p.angleAcceleration;
    p.angleVelocity *= p.damping;
    p.angle += p.angleVelocity;

    const bobX = p.originX + p.length * Math.sin(p.angle);
    const bobY = p.originY + p.length * Math.cos(p.angle);

    // Trail
    p.trail.push({ x: bobX, y: bobY });
    if (p.trail.length > 30) p.trail.shift();

    // Draw trail
    this.ctx.beginPath();
    for (let i = 0; i < p.trail.length; i++) {
      const alpha = (i / p.trail.length) * 0.4;
      this.ctx.strokeStyle = `rgba(0, 229, 153, ${alpha})`;
      this.ctx.lineWidth = 2;
      if (i === 0) this.ctx.moveTo(p.trail[i].x, p.trail[i].y);
      else this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
    }
    this.ctx.stroke();

    // Draw Pivot Point
    this.ctx.fillStyle = '#f5b041';
    this.ctx.beginPath();
    this.ctx.arc(p.originX, p.originY, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Rod
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(p.originX, p.originY);
    this.ctx.lineTo(bobX, bobY);
    this.ctx.stroke();

    // Draw Bob with Glow
    this.ctx.save();
    this.ctx.shadowColor = '#00e599';
    this.ctx.shadowBlur = 18;
    this.ctx.fillStyle = '#00e599';
    this.ctx.beginPath();
    const bobRadius = Math.max(10, Math.min(26, p.mass));
    this.ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // Information HUD
    const periodT = (2 * Math.PI * Math.sqrt((p.length / 40) / p.gravity)).toFixed(2);
    const speed = Math.abs(p.angleVelocity * p.length).toFixed(1);

    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.font = '13px "Hind Siliguri", sans-serif';
    this.ctx.fillText(`পর্যায়কাল (T): ${periodT} সেকেন্ড`, 20, 30);
    this.ctx.fillText(`কৌণিক বেগ: ${speed} px/s`, 20, 52);
    this.ctx.fillText(`সূত্র: T = 2π √(L / g)`, 20, 74);
  }

  drawRefraction() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const midY = h / 2;
    const midX = w / 2;
    const ref = this.refraction;

    // Draw Media
    // Top: Air
    this.ctx.fillStyle = 'rgba(6, 9, 18, 0.9)';
    this.ctx.fillRect(0, 0, w, midY);

    // Bottom: Medium 2
    let medColor = 'rgba(30, 58, 138, 0.35)'; // Water
    if (ref.n2 > 1.4) medColor = 'rgba(13, 148, 136, 0.35)'; // Glass
    if (ref.n2 > 2.0) medColor = 'rgba(139, 92, 246, 0.35)'; // Diamond
    this.ctx.fillStyle = medColor;
    this.ctx.fillRect(0, midY, w, midY);

    // Interface Line
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, midY);
    this.ctx.lineTo(w, midY);
    this.ctx.stroke();

    // Normal Line (অভিলম্ব)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 20);
    this.ctx.lineTo(midX, h - 20);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Calculate Angles
    const theta1Rad = (ref.incidentAngleDeg * Math.PI) / 180;
    const sinTheta2 = (ref.n1 * Math.sin(theta1Rad)) / ref.n2;

    // Incident Ray (আপতিত রশ্মি)
    const rayLength = 160;
    const startX = midX - rayLength * Math.sin(theta1Rad);
    const startY = midY - rayLength * Math.cos(theta1Rad);

    this.ctx.strokeStyle = '#ff334b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(midX, midY);
    this.ctx.stroke();

    // Incident Arrow
    this.ctx.fillStyle = '#ff334b';
    this.ctx.beginPath();
    this.ctx.arc(midX, midY, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Refracted Ray (প্রতিসরিত রশ্মি) or Total Internal Reflection
    if (sinTheta2 <= 1.0) {
      const theta2Rad = Math.asin(sinTheta2);
      const theta2Deg = ((theta2Rad * 180) / Math.PI).toFixed(1);

      const endX = midX + rayLength * Math.sin(theta2Rad);
      const endY = midY + rayLength * Math.cos(theta2Rad);

      this.ctx.strokeStyle = '#00e599';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(midX, midY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Info HUD
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = '14px "Hind Siliguri", sans-serif';
      this.ctx.fillText(`আপতন কোণ (θ₁): ${ref.incidentAngleDeg}°`, 20, 30);
      this.ctx.fillText(`প্রতিসরণ কোণ (θ₂): ${theta2Deg}°`, 20, 52);
      this.ctx.fillText(`স্নেলের সূত্র: n₁ sin(θ₁) = n₂ sin(θ₂)`, 20, 74);
    } else {
      // Total Internal Reflection
      this.ctx.fillStyle = '#f5b041';
      this.ctx.font = '14px "Hind Siliguri", sans-serif';
      this.ctx.fillText(`পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটেছে! (Total Internal Reflection)`, 20, 40);
    }

    // Media Labels
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.font = '12px "Hind Siliguri", sans-serif';
    this.ctx.fillText(`মাধ্যম ১: বায়ু (n₁ = 1.00)`, w - 160, midY - 14);
    this.ctx.fillText(`মাধ্যম ২: প্রতিসরাঙ্ক (n₂ = ${ref.n2})`, w - 160, midY + 24);
  }
}

window.ScienceLab = ScienceLab;
