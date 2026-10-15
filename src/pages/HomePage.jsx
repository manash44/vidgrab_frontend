import React, { useState, useMemo } from 'react'
import {
  Video, Headphones, X, Clipboard,
  Download, CheckCircle, Zap, Loader2,
  RotateCcw, Sparkles, Shield, Cpu, Flame,
  FileCheck, Music, Check, ArrowRight, ExternalLink
} from 'lucide-react'

const PLATFORMS = [
  { name: 'All Sites', color: '#FF2A5F', dot: '#FF2A5F' },
  { name: 'YouTube', color: '#FF0000', dot: '#FF0000', example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { name: 'Instagram', color: '#E1306C', dot: '#E1306C', example: 'https://www.instagram.com/reel/' },
  { name: 'TikTok', color: '#00F2FE', dot: '#00F2FE', example: 'https://www.tiktok.com/@' },
  { name: 'Twitter / X', color: '#1D9BF0', dot: '#1D9BF0', example: 'https://x.com/' },
  { name: 'Reddit', color: '#FF4500', dot: '#FF4500', example: 'https://www.reddit.com/r/' },
  { name: 'Facebook', color: '#1877F2', dot: '#1877F2', example: 'https://www.facebook.com/watch/' },
  { name: 'SoundCloud', color: '#FF5500', dot: '#FF5500', example: 'https://soundcloud.com/' },
  { name: 'Vimeo', color: '#1AB7EA', dot: '#1AB7EA', example: 'https://vimeo.com/' },
  { name: '1000+ More', color: '#8B5CF6', dot: '#8B5CF6' }
]

const HomePage = ({
  activeTab, setActiveTab,
  downloadMode, setDownloadMode,
  urls, setUrls,
  loading, inputRef,
  handleDownload, handlePaste, handleSaveFile,
  quality, setQuality,
  tasks, clearTasks
}) => {
  const [activePlatform, setActivePlatform] = useState('All Sites')

  // Real-time domain / platform detector from input
  const detectedPlatform = useMemo(() => {
    if (!urls) return null
    const val = urls.toLowerCase().trim()
    if (val.includes('youtube.com') || val.includes('youtu.be')) return { name: 'YouTube', color: '#FF0000' }
    if (val.includes('instagram.com')) return { name: 'Instagram', color: '#E1306C' }
    if (val.includes('tiktok.com')) return { name: 'TikTok', color: '#00F2FE' }
    if (val.includes('twitter.com') || val.includes('x.com')) return { name: 'Twitter / X', color: '#1D9BF0' }
    if (val.includes('reddit.com')) return { name: 'Reddit', color: '#FF4500' }
    if (val.includes('facebook.com') || val.includes('fb.watch')) return { name: 'Facebook', color: '#1877F2' }
    if (val.includes('soundcloud.com')) return { name: 'SoundCloud', color: '#FF5500' }
    if (val.includes('vimeo.com')) return { name: 'Vimeo', color: '#1AB7EA' }
    if (val.includes('pinterest.com')) return { name: 'Pinterest', color: '#E60023' }
    if (val.includes('xhamster')) return { name: 'XHamster', color: '#FFA000' }
    return null
  }, [urls])

  const handlePlatformClick = (platform) => {
    setActivePlatform(platform.name)
    if (platform.example && (!urls || urls.trim() === '')) {
      setUrls(platform.example)
      inputRef?.current?.focus()
    }
  }

  const activeTaskCount = tasks ? Object.keys(tasks).length : 0

  return (
    <div className="fade-up">
      {/* ── Platform Showcase Strip ── */}
      <div className="platform-strip-container">
        <div className="platform-strip-label">
          <span>Supported Platforms</span>
          <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>1000+ Websites Supported</span>
        </div>
        <div className="platform-strip">
          {PLATFORMS.map(p => (
            <button
              key={p.name}
              type="button"
              className={`platform-chip ${activePlatform === p.name ? 'active' : ''}`}
              onClick={() => handlePlatformClick(p)}
              title={p.example ? `Explore ${p.name}` : p.name}
            >
              <span className="chip-dot" style={{ background: p.dot }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Hero & Main Console ── */}
      <div className="search-hero">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="hero-pill-badge">
            <Sparkles size={14} />
            <span>Universal Media Engine 2.2</span>
          </div>

          <h1 className="search-hero-title">
            Download <span className="accent-word">Any Video</span><br />
            In Ultra High Quality
          </h1>

          <p className="hero-subtitle" style={{ margin: '0 auto 36px auto' }}>
            Extract video & audio streams directly from YouTube, Instagram, TikTok, Twitter/X and 1000+ sources without watermarks or restrictions.
          </p>
        </div>

        {/* ── Studio Glass Console ── */}
        <div className="console-panel">
          {/* Controls Bar: Format + Mode */}
          <div className="console-header-switches">
            {/* Format Toggle */}
            <div className="fmt-toggle">
              <button
                type="button"
                className={`fmt-btn ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTab('video')}
              >
                <Video size={16} />
                <span>Video MP4</span>
                <span className="badge-pill-xs">HD / 4K</span>
              </button>
              <button
                type="button"
                className={`fmt-btn ${activeTab === 'audio' ? 'active' : ''}`}
                onClick={() => setActiveTab('audio')}
              >
                <Headphones size={16} />
                <span>Audio MP3</span>
                <span className="badge-pill-xs" style={{ background: '#7C3AED' }}>320k</span>
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="fmt-toggle" style={{ background: 'var(--bg-card)' }}>
              <button
                type="button"
                className={`fmt-btn ${downloadMode === 'single' ? 'active' : ''}`}
                onClick={() => { setDownloadMode('single'); setUrls(''); }}
                style={{ fontSize: '0.82rem', padding: '7px 14px' }}
              >
                Single Link
              </button>
              <button
                type="button"
                className={`fmt-btn ${downloadMode === 'multiple' ? 'active' : ''}`}
                onClick={() => setDownloadMode('multiple')}
                style={{ fontSize: '0.82rem', padding: '7px 14px' }}
              >
                Batch Queue
              </button>
            </div>
          </div>

          {/* URL Form Input */}
          <form onSubmit={handleDownload}>
            {downloadMode === 'single' ? (
              <div className="search-box single-mode">
                {detectedPlatform && (
                  <div
                    className="detected-platform-badge"
                    style={{ background: detectedPlatform.color }}
                  >
                    <span>{detectedPlatform.name}</span>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  inputMode="url"
                  placeholder={detectedPlatform ? `Ready to download from ${detectedPlatform.name}...` : "Paste video link here (YouTube, Instagram, TikTok, X...)"}
                  value={urls}
                  onChange={e => setUrls(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="search-input-field"
                />

                {urls && (
                  <button
                    type="button"
                    className="clear-icon-btn"
                    onClick={() => setUrls('')}
                    title="Clear"
                    aria-label="Clear link"
                  >
                    <X size={15} />
                  </button>
                )}

                <button
                  type="button"
                  className="paste-chip"
                  onClick={handlePaste}
                >
                  <Clipboard size={14} />
                  <span>Paste</span>
                </button>
              </div>
            ) : (
              <div className="search-box batch-mode">
                <div className="batch-header">
                  <span className="batch-label">Batch Download Queue (One URL per line)</span>
                  <div className="batch-actions">
                    {urls && (
                      <button
                        type="button"
                        className="batch-clear-btn"
                        onClick={() => setUrls('')}
                      >
                        <X size={13} /> Clear List
                      </button>
                    )}
                    <button
                      type="button"
                      className="paste-chip"
                      onClick={handlePaste}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Clipboard size={13} /> Paste
                    </button>
                  </div>
                </div>
                <textarea
                  ref={inputRef}
                  placeholder={"Paste multiple video URLs here (one per line)...\nhttps://www.youtube.com/watch?v=...\nhttps://www.instagram.com/reel/...\nhttps://www.tiktok.com/@..."}
                  value={urls}
                  onChange={e => setUrls(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                  rows={4}
                  className="batch-textarea"
                />
              </div>
            )}

            {/* Quality & Audio Settings Row */}
            {activeTab === 'video' ? (
              <div className="quality-row">
                <div className="quality-label">
                  <Flame size={15} color="var(--accent)" />
                  <span>Resolution Preset:</span>
                </div>
                <div className="q-chips">
                  {[
                    { label: '4K Max', val: '2160' },
                    { label: '1080p FHD', val: '1080' },
                    { label: '720p HD', val: '720' },
                    { label: '480p', val: '480' },
                    { label: '360p', val: '360' },
                  ].map(q => (
                    <button
                      key={q.val}
                      type="button"
                      className={`q-chip ${quality === q.val ? 'sel' : ''}`}
                      onClick={() => setQuality(q.val)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="quality-row">
                <div className="quality-label">
                  <Music size={15} color="var(--accent)" />
                  <span>Audio Bitrate & Metadata:</span>
                </div>
                <div className="q-chips">
                  <button
                    type="button"
                    className="q-chip sel"
                    style={{ background: 'var(--accent-primary)' }}
                  >
                    320 kbps High Quality • Auto Cover Art
                  </button>
                </div>
              </div>
            )}

            {/* Download CTA Button */}
            <button
              type="submit"
              className={`dl-btn ${loading ? 'processing' : ''}`}
              disabled={!urls || loading}
            >
              {loading ? (
                <>
                  <span className="spin"><Loader2 size={22} /></span>
                  <span>Connecting to Stream Server...</span>
                </>
              ) : (
                <>
                  <Download size={22} />
                  <span>{activeTab === 'audio' ? 'Convert & Extract MP3 Audio' : 'Start Instant Video Download'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Active & Completed Downloads Queue ── */}
        {activeTaskCount > 0 && (
          <div className="active-tasks-container">
            <div className="active-tasks-header">
              <h3 className="active-tasks-title">
                <Zap size={18} color="var(--accent)" />
                <span>Active Downloads ({activeTaskCount})</span>
              </h3>
              <button
                type="button"
                onClick={clearTasks}
                className="clear-queue-btn"
              >
                Clear All
              </button>
            </div>

            {Object.entries(tasks).map(([tid, st]) => (
              <div key={tid} className="status-card fade-up">
                <div className="status-top">
                  <span className="status-url" title={st.url}>
                    {st.url}
                  </span>
                  <span className={`status-label ${st.status === 'error' ? 'err' : st.status === 'ready' ? 'ok' : ''}`}>
                    {st.status === 'downloading' && '⚡ Downloading…'}
                    {st.status === 'queued'      && '⏳ In Queue…'}
                    {st.status === 'error'       && '✕ Failed'}
                    {st.status === 'ready'       && '✓ Completed'}
                  </span>
                  {st.status === 'downloading' && (
                    <span className="status-pct">{Math.round(st.progress || 0)}%</span>
                  )}
                </div>

                {/* Progress Bar */}
                {st.status === 'downloading' && (
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style={{ width: `${Math.max(4, Math.min(100, st.progress || 0))}%` }}
                    />
                  </div>
                )}

                {/* Status Message */}
                {st.message && (
                  <p className="status-msg">
                    {st.message === 'Processing conversion...' ? 'Merging & finalizing video stream...' : st.message}
                  </p>
                )}

                {/* Speed & Metadata Info */}
                {(st.speed || st.eta || st.size || st.file_size_str) && st.status === 'downloading' && (
                  <div className="status-speed-row">
                    {st.speed && <span><Zap size={13} color="var(--accent)" /> {st.speed}</span>}
                    {st.eta && <span>⏱ ETA {st.eta}</span>}
                    {(st.size || st.file_size_str) && <span>📦 {st.size || st.file_size_str}</span>}
                  </div>
                )}

                {/* Error Retry Button */}
                {st.status === 'error' && st.url && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleDownload(null, st.url)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '9px 18px',
                        color: 'var(--text)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={14} color="var(--accent)" /> Retry Task
                    </button>
                  </div>
                )}

                {/* Ready Save Button */}
                {st.status === 'ready' && (
                  <button
                    type="button"
                    className="dl-btn done"
                    onClick={() => handleSaveFile(tid)}
                    style={{ marginTop: '18px', padding: '16px', borderRadius: '18px' }}
                  >
                    <CheckCircle size={20} />
                    <span>Save {st.filename || 'File'} to Device</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Feature Highlights Grid ── */}
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Turbo Acceleration</h3>
            <p className="feature-desc">
              Multi-threaded chunked downloads bypass bandwidth throttling, delivering up to 10x faster extraction directly from source servers.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }}>
              <Flame size={24} />
            </div>
            <h3 className="feature-title">Original 4K & Lossless</h3>
            <p className="feature-desc">
              Pristine quality with zero re-encoding loss. Extract up to 2160p 60fps video and studio-grade 320kbps MP3 audio with cover art.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
              <Shield size={24} />
            </div>
            <h3 className="feature-title">Private & Clean</h3>
            <p className="feature-desc">
              Zero logs, no telemetry, and zero intrusive ads. Downloads are streamed directly to your browser and purged automatically from server storage.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
              <Cpu size={24} />
            </div>
            <h3 className="feature-title">Universal Compatibility</h3>
            <p className="feature-desc">
              Works across all platforms — Desktop Chrome, iOS Safari, Android, and tablets with automatic PWA offline install support.
            </p>
          </div>
        </div>

        {/* ── 3-Step Guide ── */}
        <div className="steps-container">
          <h2 className="steps-title">How To Download In 3 Simple Steps</h2>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-num">1</div>
              <h4 className="step-heading">Paste Video URL</h4>
              <p className="step-sub">Copy the link of any video from YouTube, TikTok, Reels, or X and paste it into the console above.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h4 className="step-heading">Choose Format</h4>
              <p className="step-sub">Select MP4 video resolution (up to 4K) or MP3 audio with automatic high-res thumbnail embedding.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h4 className="step-heading">Download & Enjoy</h4>
              <p className="step-sub">Hit download and your media is parsed, packaged, and saved straight to your local device downloads.</p>
            </div>
          </div>
        </div>

        {/* Version footer */}
        <div className="version-tag" style={{ marginTop: 50, marginBottom: 20, textAlign: 'center' }}>
          VidGetNow Ultra v2.2.1 • Universal High-Speed Media Downloader<br />
          Built with React 19 & High Performance Cloud Backend
        </div>
      </div>
    </div>
  )
}

export default HomePage
