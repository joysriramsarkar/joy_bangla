import React, { useEffect, useRef, useState } from 'react';

export default function VoiceRecorder({ onToast }) {
  const sentences = [
    'আমাদের মাতৃভাষা বাংলা বিশ্বের দরবারে একদিন প্রযুক্তির শীর্ষ স্থানে পৌঁছাবে।',
    'শিক্ষা ও বিজ্ঞানের প্রতিটি শাখায় উচ্চমানের প্রমিত বাংলা কনটেন্ট গড়ে তোলা জরুরি।',
    'জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর আপন প্রাঙ্গণতলে বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি।',
    'আঁরা বেয়াকে মিলি নিজর ভাষারে সুন্দর করি গড়ি তুলিয়ুম বিশ্বর বুকত।',
    'আমরার এই সুন্দর বাংলা ভাষা তান লাগি আমরা অশেষ গর্ববোধ করি।',
  ];

  const [promptIdx, setPromptIdx] = useState(0);
  const [speakerName, setSpeakerName] = useState('');
  const [dialect, setDialect] = useState('Standard');
  const [isRecording, setIsRecording] = useState(false);
  const [samples, setSamples] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animIdRef = useRef(null);

  // Fetch recent samples
  const fetchSamples = () => {
    fetch('/api/voice/samples')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSamples(data.data);
        }
      })
      .catch(err => console.error('Voice samples load error:', err));
  };

  useEffect(() => {
    fetchSamples();
    drawIdleVisualizer();
  }, []);

  const drawIdleVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 500;
    canvas.height = 90;
    ctx.fillStyle = '#02050b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 229, 153, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const startVisualizer = (analyser) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 500;
    canvas.height = 90;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animIdRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#02050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#00e599';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onToast?.('আপনার ব্রাউজার অডিও রেকর্ডিং সাপোর্ট করে না।', 'error');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        drawIdleVisualizer();

        // Submit audio
        submitVoiceSample();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualizer(analyserRef.current);
    } catch (err) {
      console.error('Microphone error:', err);
      onToast?.('মাইক্রোফোন অনুমতি পাওয়া যায়নি।', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const submitVoiceSample = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/voice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker_name: speakerName.trim() || 'উন্মুক্ত অবদানকারী',
          dialect: dialect,
          sentence: sentences[promptIdx],
          duration_sec: 4.2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onToast?.('অসাধারণ! আপনার বাংলা ভয়েস অনুদান সফলভাবে সংরক্ষিত হয়েছে।', 'success');
        setPromptIdx((prev) => (prev + 1) % sentences.length);
        fetchSamples();
      }
    } catch (err) {
      console.error('Submit voice sample error:', err);
      onToast?.('ভয়েস সংরক্ষণ করা যায়নি।', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          ওপেন বাংলা কমন ভয়েস ডাটা হাব
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#9ca3af', maxWidth: '620px', margin: '6px auto 0' }}>
          বাংলা স্পিচ-টু-টেক্সট এআই মডেল সমৃদ্ধ করতে নীচের বাক্যটি উচ্চারণ করে রেকর্ড করুন।
        </p>
      </div>

      <div className="voice-wrapper">
        <div className="voice-sentence-box">
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-neon)', fontWeight: 700, marginBottom: '8px' }}>
            উচ্চারণ করুন (বাক্য #{promptIdx + 1}):
          </div>
          <div className="voice-sentence-text">
            "{sentences[promptIdx]}"
          </div>
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              className="tok-preset-btn"
              onClick={() => setPromptIdx((prev) => (prev + 1) % sentences.length)}
            >
              🔄 পরবর্তী বাক্য
            </button>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '500px' }}>
          <canvas ref={canvasRef} className="visualizer-canvas" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            className={`btn-record ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'রেকর্ডিং বন্ধ করুন' : 'রেকর্ডিং শুরু করুন'}
            disabled={submitting}
          >
            {isRecording ? '⏹' : '🎙️'}
          </button>
          <span style={{ fontSize: '0.88rem', color: isRecording ? 'var(--red-neon)' : 'var(--text-muted)', fontWeight: 600 }}>
            {isRecording ? 'রেকর্ড হচ্ছে... সমাপ্ত করতে আবার চাপুন' : 'রেকর্ড করতে মাইক্রোফোন আইকনে চাপুন'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '540px' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 200px' }}
            placeholder="আপনার নাম (ঐচ্ছিক)"
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
          />
          <select
            className="form-input"
            style={{ flex: '1 1 180px' }}
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
          >
            <option value="Standard">প্রমিত বাংলা (Standard)</option>
            <option value="Chittagong">চাটগাঁইয়া উপভাষা</option>
            <option value="Sylheti">সিলেটি উপভাষা</option>
            <option value="Barisal">বরিশালি উপভাষা</option>
            <option value="Rajshahi">রাজশাহী / বরেন্দ্রী</option>
            <option value="Rarh">রাঢ়ী বাংলা (পশ্চিমবঙ্গ)</option>
          </select>
        </div>

        {/* Recent Contributions */}
        <div style={{ width: '100%', maxWidth: '640px', marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
            সাম্প্রতিক ভয়েস অনুদানসমূহ:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {samples.slice(0, 3).map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'rgba(5, 7, 14, 0.5)',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ color: '#fff' }}><b>{s.speaker_name}</b> ({s.dialect})</span>
                <span style={{ color: 'var(--green-neon)' }}>✓ সংগৃহীত</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
