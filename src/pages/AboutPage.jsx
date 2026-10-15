import React, { useState } from 'react';
import {
  Shield, Zap, Globe, Github, Twitter, Mail, HelpCircle,
  FileText, Cpu, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Layers, Terminal
} from 'lucide-react';

const FAQS = [
  {
    q: 'Is VidGetNow completely free to use?',
    a: 'Yes, 100% free with zero paywalls, subscription fees, or mandatory account registrations. You can download as many videos and audio tracks as your bandwidth allows.'
  },
  {
    q: 'Which video qualities and formats are supported?',
    a: 'VidGetNow extracts full uncompressed native resolutions up to 4K Ultra HD (2160p), 1080p FHD, 720p HD, and 480p in MP4/MKV. For audio, it encodes directly to high-bitrate 320kbps MP3 with embedded album art.'
  },
  {
    q: 'Where are my downloaded files saved?',
    a: 'On Windows and Mac desktop browsers, files are saved directly into your system "Downloads" directory. On Android and iOS mobile devices, files are saved to your Downloads or Files app.'
  },
  {
    q: 'What should I do if a YouTube link gives an age gate or bot verification error?',
    a: 'VidGetNow uses intelligent client spoofing (TV, iOS Safari, Web Safari) to bypass restrictions. For heavily rate-limited links, you can enable browser cookie extraction in Settings or run VidGetNow locally using Option 1 in vidgetnow.cmd.'
  },
  {
    q: 'Does VidGetNow log or track my downloads?',
    a: 'No. VidGetNow maintains a strict zero-log privacy architecture. We do not store query histories, user IP addresses, or personal identifiers. Temporary download files on the server are purged automatically after each session.'
  }
];

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <div className="page-wrap fade-up">
      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-pill-badge" style={{ margin: '0 auto 16px auto' }}>
          <Sparkles size={14} />
          <span>Next-Gen Media Extraction Engine</span>
        </div>

        <h1 className="search-hero-title">
          About <span className="accent-word">VidGetNow</span>
        </h1>
        <p className="hero-subtitle" style={{ margin: '0 auto' }}>
          The world's most versatile, privacy-focused universal video downloader and audio converter.
        </p>

        {/* Tech Stack Badges */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {['React 19', 'Vite 7', 'yt-dlp Engine', 'FFmpeg Transcoder', 'Dockerized', 'Capacitor Android'].map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Core Pillars Grid ── */}
      <div className="features-grid" style={{ marginTop: 0, marginBottom: '40px' }}>
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <Zap size={24} />
          </div>
          <h3 className="feature-title">Lightning Acceleration</h3>
          <p className="feature-desc">
            Proprietary stream extraction splits content into parallel chunks, delivering download speeds up to 500% faster than standard browser downloaders.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
            <Shield size={24} />
          </div>
          <h3 className="feature-title">Zero-Log Privacy</h3>
          <p className="feature-desc">
            We operate with a strict zero-telemetry policy. Your requests are processed ephemerally in RAM or temporary scratch storage and immediately deleted.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }}>
            <Globe size={24} />
          </div>
          <h3 className="feature-title">1000+ Platforms</h3>
          <p className="feature-desc">
            From social media titans (Instagram Reels, TikTok, YouTube Shorts, X) to streaming portals (Reddit, Vimeo, SoundCloud), extract anything seamlessly.
          </p>
        </div>
      </div>

      {/* ── Architecture Pipeline ── */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Layers size={22} color="var(--accent)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>How the Engine Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '6px' }}>01. ANALYSIS</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Manifest Parsing</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Extracts HLS / DASH manifests and discovers highest bitrate stream keys.</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '6px' }}>02. STREAMING</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Parallel Ingestion</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Downloads video & audio fragments concurrently with auto-retry on dropouts.</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981', marginBottom: '6px' }}>03. PACKAGING</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Lossless Muxing</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>FFmpeg combines elementary streams and embeds ID3 cover art into MP3 files.</div>
          </div>
        </div>
      </div>

      {/* ── Interactive FAQ Accordion ── */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <HelpCircle size={22} color="var(--accent)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: '16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--accent)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 20px 20px',
                      color: 'var(--text-dim)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '14px'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Community & Links ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '40px'
      }}>
        <a
          href="https://github.com/manash44/vidgrab"
          target="_blank"
          rel="noopener noreferrer"
          className="hist-item"
          style={{ textDecoration: 'none', padding: '16px' }}
        >
          <Github size={22} color="var(--text)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>Open Source</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GitHub Repository</div>
          </div>
        </a>

        <a
          href="mailto:support@vidgetnow.app"
          className="hist-item"
          style={{ textDecoration: 'none', padding: '16px' }}
        >
          <Mail size={22} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>Support Contact</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>support@vidgetnow.app</div>
          </div>
        </a>

        <div className="hist-item" style={{ padding: '16px', cursor: 'default' }}>
          <FileText size={22} color="#8B5CF6" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>Personal Use Tool</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Respect creator copyrights</div>
          </div>
        </div>
      </div>

      <div className="version-tag" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Built with ❤️ for High-Speed Media Freedom • VidGetNow v2.2.1 Stable
      </div>
    </div>
  );
};

export default AboutPage;
