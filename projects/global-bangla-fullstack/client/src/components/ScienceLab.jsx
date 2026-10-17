import React, { useEffect, useRef, useState } from 'react';

export default function ScienceLab() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('pendulum'); // 'pendulum' or 'refraction'

  // Pendulum State
  const [length, setLength] = useState(180);
  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(15);

  // Refraction State
  const [incidentAngle, setIncidentAngle] = useState(45);
  const [refractiveIndex, setRefractiveIndex] = useState(1.33); // water

  // Physics animation refs
  const physicsRef = useRef({
    angle: Math.PI / 4,
    angleVelocity: 0,
    angleAcceleration: 0,
    damping: 0.998,
    trail: [],
  });

  // Calculate Refraction parameters
  const theta1Rad = (incidentAngle * Math.PI) / 180;
  const sinTheta2 = (1.0 * Math.sin(theta1Rad)) / refractiveIndex;
  const isTIR = sinTheta2 > 1.0;
  const theta2Deg = isTIR ? null : Math.round(((Math.asin(sinTheta2) * 180) / Math.PI) * 10) / 10;
  const criticalAngleDeg = refractiveIndex > 1.0 ? Math.round(((Math.asin(1.0 / refractiveIndex) * 180) / Math.PI) * 10) / 10 : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width || 600;
      canvas.height = 380;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'pendulum') {
        const originX = canvas.width / 2;
        const originY = 40;
        const p = physicsRef.current;

        // Pendulum equation: alpha = -(g / L) * sin(theta)
        p.angleAcceleration = (-(gravity * 0.05) / (length * 0.1)) * Math.sin(p.angle);
        p.angleVelocity += p.angleAcceleration;
        p.angleVelocity *= p.damping;
        p.angle += p.angleVelocity;

        const bobX = originX + length * Math.sin(p.angle);
        const bobY = originY + length * Math.cos(p.angle);

        // Trail
        p.trail.push({ x: bobX, y: bobY });
        if (p.trail.length > 28) p.trail.shift();

        // Draw Trail
        ctx.beginPath();
        for (let i = 0; i < p.trail.length; i++) {
          const pt = p.trail[i];
          ctx.strokeStyle = `rgba(0, 229, 153, ${(i / p.trail.length) * 0.4})`;
          ctx.lineWidth = 2;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Support bar
        ctx.fillStyle = '#334155';
        ctx.fillRect(originX - 60, originY - 8, 120, 8);

        // String
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, mass, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, mass);
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(1, '#059669');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#00e599';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Information HUD
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Hind Siliguri", sans-serif';
        const tPeriod = (2 * Math.PI * Math.sqrt(length / (gravity * 10))).toFixed(2);
        ctx.fillText(`পর্যায়কাল (T): ≈ ${tPeriod} সে.`, 20, 30);
        ctx.fillText(`কৌণিক সরণ: ${(p.angle * (180 / Math.PI)).toFixed(1)}°`, 20, 50);
      } else {
        // Refraction Simulation
        const w = canvas.width;
        const h = canvas.height;
        const midY = h / 2;
        const midX = w / 2;

        // Top medium: Air (n1 = 1.0)
        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, w, midY);

        // Bottom medium (n2)
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fillRect(0, midY, w, midY);

        // Interface line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();

        // Normal line (অভিলম্ব)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(midX, 20);
        ctx.lineTo(midX, h - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Incident Ray
        const rayLen = 170;
        const incX = midX - rayLen * Math.sin(theta1Rad);
        const incY = midY - rayLen * Math.cos(theta1Rad);

        ctx.strokeStyle = '#ff334b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(incX, incY);
        ctx.lineTo(midX, midY);
        ctx.stroke();

        // Refracted or Reflected Ray
        if (isTIR) {
          // Total Internal Reflection
          const refX = midX + rayLen * Math.sin(theta1Rad);
          const refY = midY - rayLen * Math.cos(theta1Rad);
          ctx.strokeStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(refX, refY);
          ctx.stroke();
        } else {
          const theta2Rad = (theta2Deg * Math.PI) / 180;
          const refrX = midX + rayLen * Math.sin(theta2Rad);
          const refrY = midY + rayLen * Math.cos(theta2Rad);
          ctx.strokeStyle = '#00e599';
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(refrX, refrY);
          ctx.stroke();
        }

        // Labels
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '13px "Hind Siliguri", sans-serif';
        ctx.fillText('মাধ্যম ১: বায়ু (n₁ = ১.০)', 20, 30);
        ctx.fillText(`মাধ্যম ২: n₂ = ${refractiveIndex}`, 20, midY + 30);
        ctx.fillText(`আপতন কোণ (θ₁): ${incidentAngle}°`, midX - 140, midY - 20);
        if (isTIR) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR) ঘটেছে!', midX + 20, midY - 20);
        } else {
          ctx.fillStyle = '#00e599';
          ctx.fillText(`প্রতিসরণ কোণ (θ₂): ${theta2Deg}°`, midX + 20, midY + 40);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [mode, length, gravity, mass, incidentAngle, refractiveIndex, theta1Rad, theta2Deg, isTIR]);

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            ইন্টারঅ্যাক্টিভ পদার্থবিজ্ঞান সিমুলেটর
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            রিয়েল-টাইম ক্যানভাসে বলবিদ্যা ও আলোকবিজ্ঞানের সূত্রসমূহ সরাসরি পরীক্ষা করুন।
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`tab-btn ${mode === 'pendulum' ? 'active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.88rem' }}
            onClick={() => setMode('pendulum')}
          >
            সরল দোলক
          </button>
          <button
            className={`tab-btn ${mode === 'refraction' ? 'active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.88rem' }}
            onClick={() => setMode('refraction')}
          >
            আলোর প্রতিসরণ
          </button>
        </div>
      </div>

      <div className="sim-container">
        {/* Canvas */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} style={{ width: '100%', height: '380px', display: 'block' }} />
        </div>

        {/* Controls Panel */}
        <div className="sim-controls">
          {mode === 'pendulum' ? (
            <>
              <div className="sim-control-group">
                <div className="sim-label">
                  <span>রশির দৈর্ঘ্য (L):</span>
                  <span style={{ color: 'var(--green-neon)', fontFamily: 'monospace' }}>{length} px</span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min="80"
                  max="260"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                />
              </div>

              <div className="sim-control-group">
                <div className="sim-label">
                  <span>অভিকর্ষজ ত্বরণ (g):</span>
                  <span style={{ color: 'var(--gold-neon)', fontFamily: 'monospace' }}>{gravity} m/s²</span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min="1.6"
                  max="25"
                  step="0.2"
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>চাঁদ (১.৬)</span>
                  <span>পৃথিবী (৯.৮)</span>
                  <span>বৃহস্পতি (২৪.৮)</span>
                </div>
              </div>

              <div className="sim-control-group">
                <div className="sim-label">
                  <span>ববের ভর (m):</span>
                  <span style={{ color: 'var(--red-neon)', fontFamily: 'monospace' }}>{mass} kg</span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min="6"
                  max="28"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                />
              </div>
            </>
          ) : (
            <>
              <div className="sim-control-group">
                <div className="sim-label">
                  <span>আপতন কোণ (θ₁):</span>
                  <span style={{ color: '#ff334b', fontFamily: 'monospace' }}>{incidentAngle}°</span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min="5"
                  max="85"
                  value={incidentAngle}
                  onChange={(e) => setIncidentAngle(Number(e.target.value))}
                />
              </div>

              <div className="sim-control-group">
                <div className="sim-label">
                  <span>দ্বিতীয় মাধ্যম (প্রতিসরাঙ্ক n₂):</span>
                  <span style={{ color: 'var(--green-neon)', fontFamily: 'monospace' }}>{refractiveIndex}</span>
                </div>
                <select
                  className="form-input"
                  style={{ padding: '8px 12px' }}
                  value={refractiveIndex}
                  onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                >
                  <option value="1.33">জল (Water) — ১.৩৩</option>
                  <option value="1.52">সাধারণ কাচ (Crown Glass) — ১.৫২</option>
                  <option value="1.66">ঘন ফ্লিন্ট কাচ (Flint Glass) — ১.৬৬</option>
                  <option value="2.42">হীরা (Diamond) — ২.৪২</option>
                </select>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <div><b>স্নেলের সূত্র:</b> n₁ sin(θ₁) = n₂ sin(θ₂)</div>
                {criticalAngleDeg && (
                  <div style={{ marginTop: '4px', color: 'var(--gold-neon)' }}>
                    <b>সংকট কোণ:</b> {criticalAngleDeg}°
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
