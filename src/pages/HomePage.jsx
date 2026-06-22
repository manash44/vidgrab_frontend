import React from 'react'
import {
  Video, Headphones, X, Clipboard,
  Download, CheckCircle, Zap, Shield,
  Globe, Loader2, Wifi, WifiOff
} from 'lucide-react'

const PLATFORMS = [
  { name: 'All',       color: '#FF3B5C', dot: '#FF3B5C' },
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
  urls, setUrls,
  loading, inputRef,
  handleDownload, handlePaste, handleSaveFile,
  quality, setQuality,
  tasks, clearTasks
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
          <div className="search-box" style={{ alignItems: 'flex-start', padding: '16px' }}>
            <textarea
              ref={inputRef}
              placeholder="Paste one or multiple video links here (one per line)…"
              value={urls}
              onChange={e => setUrls(e.target.value)}
              disabled={loading}
              autoComplete="off"
              rows={3}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '1.05rem',
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
            />
            {urls && (
              <button type="button" className="clear-btn" onClick={() => setUrls('')} style={{ alignSelf: 'flex-start' }}>
                <X size={16} />
              </button>
            )}
            <button type="button" className="paste-chip" onClick={handlePaste} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              <Clipboard size={12} style={{marginRight:4,verticalAlign:'middle'}}/>Paste
            </button>
          </div>

          {/* Quality row (video only) */}
          {activeTab === 'video' && (
            <div className="quality-row">
              <span>Quality:</span>
              <div className="q-chips">
                {['1080','720','480','360'].map(q => (
                  <button
                    key={q}
                    type="button"
                    className={`q-chip ${quality === q ? 'sel' : ''}`}
                    onClick={() => setQuality(q)}
                  >
                    {q}p
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main action button */}
          <button
            type="submit"
            className={`dl-btn ${loading ? 'processing' : ''}`}
            disabled={!urls || loading}
          >
            {loading
              ? <><span className="spin"><Loader2 size={18}/></span> Submitting tasks…</>
              : <><Download size={18}/> {activeTab === 'audio' ? 'Convert to MP3' : 'Download Video'}</>
            }
          </button>
        </form>
      </div>

      {/* Status cards for multiple downloads */}
      {tasks && Object.keys(tasks).length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Downloads ({Object.keys(tasks).length})</h3>
            <button type="button" onClick={clearTasks} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All</button>
          </div>
          
          {Object.entries(tasks).map(([tid, st]) => (
            <div key={tid} className="status-card fade-up">
              <div className="status-top">
                <span className="status-url" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem', color: 'var(--text-dim)', marginRight: '12px' }}>
                  {st.url}
                </span>
                <span className={`status-label ${st.status === 'error' ? 'err' : st.status === 'ready' ? 'ok' : ''}`} style={{ flexShrink: 0 }}>
                  {st.status === 'downloading' && 'Downloading…'}
                  {st.status === 'queued'      && 'Queued…'}
                  {st.status === 'error'       && '✕ Failed'}
                  {st.status === 'ready'       && '✓ Complete'}
                </span>
                {st.status === 'downloading' && (
                  <span className="status-pct" style={{ flexShrink: 0, marginLeft: '8px' }}>{Math.round(st.progress || 0)}%</span>
                )}
              </div>

              {st.status === 'downloading' && (
                <div className="prog-track">
                  <div className="prog-fill" style={{ width:`${st.progress || 0}%` }} />
                </div>
              )}

              {st.message && (
                <p className="status-msg">
                  {st.message === 'Processing conversion...' ? 'Finalizing file…' : st.message}
                </p>
              )}

              {(st.speed || st.eta) && st.status === 'downloading' && (
                <div className="status-speed-row">
                  {st.speed && <span>⬇ {st.speed}</span>}
                  {st.eta   && <span>⏱ {st.eta}</span>}
                  {(st.size || st.file_size_str) && <span>📦 {st.size || st.file_size_str}</span>}
                </div>
              )}
              
              {st.status === 'ready' && (
                <button 
                  type="button" 
                  className="dl-btn done" 
                  onClick={() => handleSaveFile(tid)}
                  style={{ marginTop: '12px', padding: '8px', fontSize: '0.9rem' }}
                >
                  <CheckCircle size={16}/> Tap to Save File
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      
      <div className="version-tag" style={{ marginTop: 40, marginBottom: 40, textAlign: 'center', width: '100%', display: 'block' }}>
        VidGetNow Premium v2.2.0 • Powered by Render<br/>
        © manshdevproductions.com
      </div>

    </div>
  )
}

export default HomePage
