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
  downloadMode, setDownloadMode,
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

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', borderRadius: '32px' }}>
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

          {/* Mode toggle */}
          <div className="fmt-toggle" style={{ marginTop: '12px', marginBottom: '24px', background: 'var(--bg-card)', border: 'none', borderRadius: '14px' }}>
            <button
              type="button"
              className={`fmt-btn ${downloadMode === 'single' ? 'active' : ''}`}
              onClick={() => { setDownloadMode('single'); setUrls(''); }}
              style={{ fontSize: '0.85rem', padding: '8px 12px', borderRadius: '10px' }}
            >
              Single Link
            </button>
            <button
              type="button"
              className={`fmt-btn ${downloadMode === 'multiple' ? 'active' : ''}`}
              onClick={() => setDownloadMode('multiple')}
              style={{ fontSize: '0.85rem', padding: '8px 12px', borderRadius: '10px' }}
            >
              Batch Mode
            </button>
          </div>

          {/* URL input */}
          <form onSubmit={handleDownload}>
            <div className="search-box" style={{ alignItems: 'flex-start' }}>
              <textarea
                ref={inputRef}
                placeholder={downloadMode === 'single' ? "Paste a single video link here..." : "Paste multiple video links here (one per line)…"}
                value={urls}
                onChange={e => setUrls(e.target.value)}
                onPaste={e => {
                  // Let native paste happen, don't auto-submit
                }}
                disabled={loading}
                autoComplete="off"
                rows={downloadMode === 'single' ? 2 : 4}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: '1.05rem',
                  resize: 'vertical',
                  minHeight: downloadMode === 'single' ? '60px' : '100px',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
              {urls && (
                <button type="button" className="clear-btn" onClick={() => setUrls('')} style={{ alignSelf: 'flex-start', background: 'var(--bg-elevated)', borderRadius: '50%', padding: '4px', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
              <button type="button" className="paste-chip" onClick={handlePaste} style={{ alignSelf: 'flex-start', marginTop: '4px', padding: '12px 20px', borderRadius: '20px' }}>
                <Clipboard size={14} style={{marginRight:6,verticalAlign:'middle'}}/>Paste
              </button>
            </div>

            {/* Quality row (video only) */}
            {activeTab === 'video' && (
              <div className="quality-row" style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '0.9rem' }}>Quality:</span>
                <div className="q-chips">
                  {['1080','720','480','360'].map(q => (
                    <button
                      key={q}
                      type="button"
                      className={`q-chip ${quality === q ? 'sel' : ''}`}
                      onClick={() => setQuality(q)}
                      style={{ padding: '10px 18px', borderRadius: '16px' }}
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
              style={{ padding: '24px', borderRadius: '28px', marginTop: '32px' }}
            >
              {loading
                ? <><span className="spin"><Loader2 size={20}/></span> Submitting tasks…</>
                : <><Download size={20}/> {activeTab === 'audio' ? 'Convert to MP3' : 'Download Video'}</>
              }
            </button>
          </form>
        </div>

        {/* Status cards for single download focus */}
        {tasks && Object.keys(tasks).length > 0 && (
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 12px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: '800' }}>Active Downloads</h3>
              <button type="button" onClick={clearTasks} style={{ background: 'var(--bg-card)', padding: '6px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>Clear All</button>
            </div>
            
            {Object.entries(tasks).map(([tid, st]) => (
              <div key={tid} className="status-card fade-up" style={{ margin: 0, width: '100%', padding: '24px', borderRadius: '28px' }}>
                <div className="status-top">
                  <span className="status-url" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)', marginRight: '16px' }}>
                    {st.url}
                  </span>
                  <span className={`status-label ${st.status === 'error' ? 'err' : st.status === 'ready' ? 'ok' : ''}`} style={{ flexShrink: 0, background: 'var(--bg-elevated)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {st.status === 'downloading' && 'Downloading…'}
                    {st.status === 'queued'      && 'Queued…'}
                    {st.status === 'error'       && '✕ Failed'}
                    {st.status === 'ready'       && '✓ Complete'}
                  </span>
                  {st.status === 'downloading' && (
                    <span className="status-pct" style={{ flexShrink: 0, marginLeft: '12px' }}>{Math.round(st.progress || 0)}%</span>
                  )}
                </div>

                {st.status === 'downloading' && (
                  <div className="prog-track" style={{ height: '12px', marginTop: '16px' }}>
                    <div className="prog-fill" style={{ width:`${st.progress || 0}%` }} />
                  </div>
                )}

                {st.message && (
                  <p className="status-msg" style={{ marginTop: '16px' }}>
                    {st.message === 'Processing conversion...' ? 'Finalizing file…' : st.message}
                  </p>
                )}

                {(st.speed || st.eta) && st.status === 'downloading' && (
                  <div className="status-speed-row" style={{ marginTop: '20px' }}>
                    {st.speed && <span><Zap size={14} color="var(--accent)"/> {st.speed}</span>}
                    {st.eta   && <span>⏱ {st.eta}</span>}
                    {(st.size || st.file_size_str) && <span>📦 {st.size || st.file_size_str}</span>}
                  </div>
                )}
                
                {st.status === 'ready' && (
                  <button 
                    type="button" 
                    className="dl-btn done" 
                    onClick={() => handleSaveFile(tid)}
                    style={{ marginTop: '20px', padding: '16px', fontSize: '1rem', borderRadius: '20px', width: '100%' }}
                  >
                    <CheckCircle size={18}/> Tap to Save File
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="version-tag" style={{ marginTop: 40, marginBottom: 40, textAlign: 'center', width: '100%', display: 'block' }}>
        VidGetNow Premium v2.2.1 • Powered by Render<br/>
        © manshdevproductions.com
      </div>

    </div>
  )
}

export default HomePage
