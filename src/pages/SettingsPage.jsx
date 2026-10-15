import React, { useState } from 'react'
import { Sun, Moon, Trash2, Wifi, Settings, Zap, Globe, RefreshCw, Server } from 'lucide-react'

const SettingsPage = ({
  theme, toggleTheme,
  quality, setQuality,
  browserCookie, setBrowserCookie,
  notificationsEnabled, setNotificationsEnabled,
  clearHistory,
  connectionStatus, checkConnection,
  backendUrl = '', onSaveBackendUrl, defaultBackendUrl = ''
}) => {
  const [urlInput, setUrlInput] = useState(backendUrl || defaultBackendUrl || '')

  const handleApplyUrl = (val) => {
    const target = val.trim()
    setUrlInput(target)
    if (onSaveBackendUrl) {
      onSaveBackendUrl(target)
    }
  }

  const getStatusText = () => {
    if (connectionStatus === 'connected') return 'Backend is online and ready.'
    if (connectionStatus === 'waking') return 'Backend is waking up (~50s on free tier)...'
    if (connectionStatus === 'checking') return 'Testing connection to server...'
    return 'Backend may be sleeping or unreachable.'
  }

  const getStatusClass = () => {
    if (connectionStatus === 'connected') return 'online'
    if (connectionStatus === 'waking') return 'waking'
    if (connectionStatus === 'checking') return 'checking'
    return 'offline'
  }

  return (
    <div className="fade-up" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Settings</h2>
        <p style={{ color: 'var(--text-dim)' }}>Manage your preferences, data, and connection.</p>
      </div>

      {/* Appearance */}
      <div className="status-card" style={{ marginLeft: 0, marginRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sun size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Appearance</h3>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>App Theme</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Switch between Light and Dark mode globally.</div>
          </div>
          
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', 
              borderRadius: 12, padding: '10px 16px', color: 'var(--text)', 
              cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 600
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* Download Preferences */}
      <div className="status-card" style={{ marginLeft: 0, marginRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Zap size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Download Preferences</h3>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Default Video Quality</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select the default resolution for new links.</div>
          </div>
          
          <div className="q-chips" style={{ background: 'var(--bg-elevated)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            {['1080','720','480','360'].map(q => (
              <button
                key={q}
                type="button"
                className={`q-chip ${quality === q ? 'sel' : ''}`}
                style={{ padding: '8px 14px' }}
                onClick={() => setQuality(q)}
              >
                {q}p
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Extract Browser Cookies</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Use local browser cookies to bypass blocks (e.g. YouTube).</div>
          </div>
          
          <select 
            value={browserCookie} 
            onChange={(e) => setBrowserCookie(e.target.value)}
            style={{ 
              background: 'var(--bg-elevated)', 
              color: 'var(--text)',
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '8px 12px',
              outline: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="none">None (Recommended)</option>
            <option value="auto">Auto Detect (Current)</option>
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="edge">Edge</option>
            <option value="safari">Safari</option>
            <option value="brave">Brave</option>
            <option value="opera">Opera</option>
            <option value="vivaldi">Vivaldi</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>System Notifications</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get an alert when a background download finishes.</div>
          </div>
          
          <div className={`toggle ${notificationsEnabled ? 'on' : ''}`} onClick={() => setNotificationsEnabled(!notificationsEnabled)}/>
        </div>
      </div>

      {/* Backend & Network */}
      <div className="status-card" style={{ marginLeft: 0, marginRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Server size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Server & Network</h3>
        </div>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Backend API URL</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Set custom endpoint URL for local execution, cloud service, or proxy tunnels.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. http://localhost:5000 or /api"
              style={{
                flex: 1,
                minWidth: '220px',
                background: 'var(--bg-elevated)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <button
              type="button"
              onClick={() => handleApplyUrl(urlInput)}
              style={{
                background: 'var(--accent-gradient)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}
            >
              Save URL
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleApplyUrl('/api')}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Proxy (/api)
            </button>
            <button
              type="button"
              onClick={() => handleApplyUrl('http://localhost:5000')}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Local (localhost:5000)
            </button>
            <button
              type="button"
              onClick={() => handleApplyUrl('https://backend-iti7.onrender.com')}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Render Cloud
            </button>
            {defaultBackendUrl && (
              <button
                type="button"
                onClick={() => handleApplyUrl(defaultBackendUrl)}
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Reset Default
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Connection Status
              <div className={`conn-dot ${getStatusClass()}`} style={{ position: 'static' }}/>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{getStatusText()}</div>
          </div>
          
          <button
            style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 16px', color:'var(--text)', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:6, fontWeight: 600 }}
            onClick={checkConnection}
          >
            {connectionStatus === 'checking' ? (
              <RefreshCw size={14} className="spin" />
            ) : (
              <Wifi size={14}/>
            )}
            {connectionStatus === 'checking' ? 'Testing…' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* Data & System */}
      <div className="status-card" style={{ marginLeft: 0, marginRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Settings size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Data Management</h3>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Download History</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clear your locally stored download history log.</div>
          </div>
          
          <button 
            className="danger-btn" 
            onClick={clearHistory}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Trash2 size={16}/> Clear History
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
