import React from 'react'
import {
  Video, Headphones, X, Clipboard,
  Download, CheckCircle, Zap, Shield,
  Globe, Loader2, Wifi, WifiOff
} from 'lucide-react'

const PLATFORMS = [
  { name: 'All',       color: '#ffd700', dot: '#ffd700' },
  { name: 'YouTube',   color: '#ff0000', dot: '#ff0000' },
  { name: 'Instagram', color: '#e1306c', dot: '#e1306c' },
  { name: 'Twitter/X', color: '#1d9bf0', dot: '#1d9bf0' },
  { name: 'TikTok',    color: '#69c9d0', dot: '#69c9d0' },
  { name: 'Reddit',    color: '#ff4500', dot: '#ff4500' },
  { name: '1000+ More',color: '#888',    dot: '#888'    },
]

const HomePage = ({
  connectionStatus,
  activeTab, setActiveTab,
  url, setUrl,
  loading, inputRef,
  handleDownload, handlePaste, handleSaveFile,
  quality, setQuality,
  status, featuresRef
}) => {
  const [activePlatform, setActivePlatform] = React.useState('All')

  return (
    <div className="fade-up">
      {/* Connection pill */}
      <div style={{ display:'flex', justifyContent:'flex-end', padding:'10px 16px 0', gap:'6px', alignItems:'center' }}>
        {connectionStatus === 'connected'
          ? <><Wifi size={13} color="#4ade80"/><span style={{fontSize:'0.72rem',color:'#4ade80',fontWeight:600}}>Server Online</span></>
          : connectionStatus === 'waking'
          ? <><Loader2 className="spin" size={13} color="#fbbf24"/><span style={{fontSize:'0.72rem',color:'#fbbf24',fontWeight:600}}>Waking Server (Takes ~50s)</span></>
          : <><WifiOff size={13} color="#f87171"/><span style={{fontSize:'0.72rem',color:'#f87171',fontWeight:600}}>Connecting…</span></>
        }
      </div>

      {/* Platform strip */}
      <div className="platform-strip">
        {PLATFORMS.map(p => (
          <button
            key={p.name}
            className={`platform-chip ${activePlatform === p.name ? 'active' : ''}`}
            onClick={() => setActivePlatform(p.name)}
          >
            <span className="chip-dot" style={{ background: p.dot }} />
            {p.name}
          </button>
        ))}
      </div>

      {/* Search hero */}
      <div className="search-hero">
        <h2 className="search-hero-title">
          Download <span className="accent-word">Anything</span><br />Instantly
        </h2>

        {/* Format toggle */}
        <div className="fmt-toggle">
          <button
            className={`fmt-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={16} /> Video
          </button>
          <button
            className={`fmt-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Headphones size={16} /> Audio MP3
          </button>
        </div>

        {/* URL input */}
        <form onSubmit={handleDownload}>
          <div className="search-box">
            <input
              ref={inputRef}
              type="url"
              placeholder="Paste video link here…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            {url && (
              <button type="button" className="clear-btn" onClick={() => setUrl('')}>
                <X size={16} />
              </button>
            )}
            <button type="button" className="paste-chip" onClick={handlePaste}>
              <Clipboard size={12} style={{marginRight:4,verticalAlign:'middle'}}/>Paste
            </button>
          </div>

          {/* Quality row (video only) */}
          {activeTab === 'video' && (
            <div className="quality-row">
              <span>Quality:</span>
              <div className="q-chips">
                {['best','1080','720','480','360'].map(q => (
                  <button
                    key={q}
                    type="button"
                    className={`q-chip ${quality === q ? 'sel' : ''}`}
                    onClick={() => setQuality(q)}
                  >
                    {q === 'best' ? 'Max' : q + 'p'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main action button */}
          {(!status || status.status !== 'ready') ? (
            <button
              type="submit"
              className={`dl-btn ${loading ? 'processing' : ''}`}
              disabled={!url || loading}
            >
              {loading
                ? <><span className="spin"><Loader2 size={18}/></span> Processing…</>
                : <><Download size={18}/> {activeTab === 'audio' ? 'Convert to MP3' : 'Download Video'}</>
              }
            </button>
          ) : (
            <button type="button" className="dl-btn done" onClick={handleSaveFile}>
              <CheckCircle size={18}/>
              {status.message?.includes('Started') ? `Downloading… ${status.fileSize || ''}` : 'Tap to Save File'}
            </button>
          )}
        </form>
      </div>

      {/* Status card */}
      {status && (
        <div className="status-card fade-up">
          <div className="status-top">
            <span className={`status-label ${status.status === 'error' ? 'err' : status.status === 'ready' ? 'ok' : ''}`}>
              {status.status === 'downloading' && 'Downloading…'}
              {status.status === 'queued'      && 'Queued…'}
              {status.status === 'error'       && '✕ Failed'}
              {status.status === 'ready'       && '✓ Complete'}
            </span>
            {status.status === 'downloading' && (
              <span className="status-pct">{Math.round(status.progress || 0)}%</span>
            )}
          </div>

          {status.status === 'downloading' && (
            <div className="prog-track">
              <div className="prog-fill" style={{ width:`${status.progress || 0}%` }} />
            </div>
          )}

          {status.message && (
            <p className="status-msg">
              {status.message === 'Processing conversion...' ? 'Finalizing file…' : status.message}
            </p>
          )}

          {(status.speed || status.eta) && status.status === 'downloading' && (
            <div className="status-speed-row">
              {status.speed && <span>⬇ {status.speed}</span>}
              {status.eta   && <span>⏱ {status.eta}</span>}
              {(status.size || status.file_size_str) && <span>📦 {status.size || status.file_size_str}</span>}
            </div>
          )}
        </div>
      )}

      {/* Feature cards */}
      <div className="features-section" ref={featuresRef}>
        <div className="section-label">Why VidGetNow?</div>
        <div className="feat-row">
          <div className="feat-card">
            <div className="feat-icon"><Zap size={18}/></div>
            <h4>Turbo Speed</h4>
            <p>Parallel chunk downloads for max bandwidth.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon"><Shield size={18}/></div>
            <h4>No Logs</h4>
            <p>Zero tracking. Your downloads stay private.</p>
          </div>
        </div>
        <div className="feat-row">
          <div className="feat-card">
            <div className="feat-icon"><Globe size={18}/></div>
            <h4>1000+ Sites</h4>
            <p>YouTube, Instagram, TikTok, Reddit & more.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon"><Headphones size={18}/></div>
            <h4>MP3 Extract</h4>
            <p>Convert any video to high-quality MP3 audio.</p>
          </div>
        </div>
        <div className="version-tag">VidGetNow v2.1.0</div>
      </div>
    </div>
  )
}

export default HomePage
