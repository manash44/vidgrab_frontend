import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  Clipboard,
  X,
  Download,
  AlertCircle,
  Loader2,
  History,
  Smartphone,
  Save,
  FileVideo,
  Music,
  Check,
  Video,
  Headphones,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  Github,
  Twitter,
  Mail,
  Wifi,
  Settings,
  Trash2,
  Bell,
  Moon,
  Sun,
  Palette
} from 'lucide-react'
import './App.css'
import { APP_CONFIG } from './config'

function App() {
  // Tabs: 'video' or 'audio'
  const [activeTab, setActiveTab] = useState('video')

  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('best')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [taskId, setTaskId] = useState(null)

  // Settings & System State
  const [showSettings, setShowSettings] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [accentColor, setAccentColor] = useState('red') // red, blue, green, purple

  // PWA & Connection
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  const pollIntervalRef = useRef(null)
  const inputRef = useRef(null)
  const featuresRef = useRef(null)

  // Initialize
  useEffect(() => {
    checkConnection()
    loadSettings()

    // PWA Install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setTimeout(() => setShowInstallBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  // Check Backend
  const checkConnection = async () => {
    setConnectionStatus('checking')
    try {
      await axios.get(`${APP_CONFIG.backendUrl}/status/test`, { timeout: 8000 })
      setConnectionStatus('connected')
    } catch (error) {
      if (error.response) setConnectionStatus('connected')
      else setConnectionStatus('error')
    }
  }

  // Load/Save Settings
  const loadSettings = () => {
    const savedHistory = localStorage.getItem('vidgrab_history')
    if (savedHistory) setHistory(JSON.parse(savedHistory))

    const savedAccent = localStorage.getItem('vidgrab_accent')
    if (savedAccent) {
      setAccentColor(savedAccent)
      document.documentElement.setAttribute('data-theme', savedAccent)
    }
  }

  const toggleAccent = (color) => {
    setAccentColor(color)
    localStorage.setItem('vidgrab_accent', color)
    document.documentElement.setAttribute('data-theme', color)
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your download history?')) {
      setHistory([])
      localStorage.removeItem('vidgrab_history')
    }
  }

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('vidgrab_history', JSON.stringify(history))
    }
  }, [history])

  // Polling for Download Status
  useEffect(() => {
    if (taskId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${APP_CONFIG.backendUrl}/status/${taskId}`)
          const data = res.data
          setStatus(data)

          if (data.status === 'ready' || data.status === 'error') {
            clearInterval(pollIntervalRef.current)
            setLoading(false)
            if (data.status === 'ready') {
              addToHistory(url, data.filename || 'Download', new Date().toLocaleString())
              if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
                new Notification("Download Ready!", { body: data.filename })
              }
              handleAutoDownload(taskId, data.filename)
            }
          }
        } catch (err) {
          console.error("Polling error", err)
        }
      }, 1000)
    }
    return () => pollIntervalRef.current && clearInterval(pollIntervalRef.current)
  }, [taskId, url, notificationsEnabled])

  const addToHistory = (link, filename, date) => {
    setHistory(prev => [{ link, filename, date, type: activeTab }, ...prev].slice(0, 20))
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    if (!url) return

    if (connectionStatus === 'error') {
      // Try one more check before failing
      await checkConnection()
      if (connectionStatus === 'error') {
        setStatus({ status: 'error', message: 'Backend disconnected. Please check your internet.' })
        return
      }
    }

    setLoading(true)
    setStatus({ status: 'queued', message: 'Initiating download...' })
    setTaskId(null)

    try {
      const response = await axios.post(`${APP_CONFIG.backendUrl}/download`, {
        url,
        format: activeTab,
        quality: activeTab === 'audio' ? 'best' : quality
      })
      setTaskId(response.data.task_id)

      // Request notification permission on first download
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }

    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Failed to start download.'
      setStatus({ status: 'error', message: errorMsg })
      setLoading(false)
    }
  }

  const triggerDownload = (id, filename) => {
    const link = document.createElement('a')
    link.href = `${APP_CONFIG.backendUrl}/file/${id}`
    link.download = filename || 'video'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAutoDownload = (id, filename) => {
    triggerDownload(id, filename)
    setTimeout(() => {
      setStatus(null)
      setTaskId(null)
      setUrl('')
    }, 2000)
  }

  const handleSaveFile = () => {
    if (!taskId || status?.status !== 'ready') return
    triggerDownload(taskId, status.filename)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      inputRef.current?.focus()
    } catch (err) {
      console.error('Clipboard error', err)
    }
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
    setShowInstallBanner(false)
  }

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-container">

      <div className="ambient-background"></div>

      {/* Settings Panel (Drawer) */}
      <div className={`settings-drawer ${showSettings ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3><Settings size={20} /> System Settings</h3>
          <button onClick={() => setShowSettings(false)}><X size={20} /></button>
        </div>
        <div className="drawer-content">

          <div className="setting-group">
            <label>Theme Accent</label>
            <div className="color-options">
              <button className={`color-btn red ${accentColor === 'red' ? 'active' : ''}`} onClick={() => toggleAccent('red')}></button>
              <button className={`color-btn blue ${accentColor === 'blue' ? 'active' : ''}`} onClick={() => toggleAccent('blue')}></button>
              <button className={`color-btn purple ${accentColor === 'purple' ? 'active' : ''}`} onClick={() => toggleAccent('purple')}></button>
              <button className={`color-btn green ${accentColor === 'green' ? 'active' : ''}`} onClick={() => toggleAccent('green')}></button>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-row">
              <div className="setting-info">
                <Bell size={18} />
                <span>Notifications</span>
              </div>
              <div className="toggle-switch" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                <div className={`switch-knob ${notificationsEnabled ? 'on' : 'off'}`}></div>
              </div>
            </div>
          </div>

          <div className="setting-group">
            <label>Data Management</label>
            <button className="danger-btn" onClick={clearHistory}>
              <Trash2 size={16} /> Clear Download History
            </button>
          </div>

          <div className="setting-group info">
            <label>System Status</label>
            <div className={`status-indicator-box ${connectionStatus}`}>
              {connectionStatus === 'connected' ? <Wifi size={16} /> : <AlertCircle size={16} />}
              <span>{connectionStatus === 'connected' ? 'Backend Online' : 'Backend Offline'}</span>
            </div>
            <small className="version-text">v2.1.0 • VidGrab Core</small>
          </div>

        </div>
      </div>
      {showSettings && <div className="backdrop" onClick={() => setShowSettings(false)}></div>}

      {/* Header */}
      <header className="app-header glass-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Download size={24} color="white" />
          </div>
          <div className="logo-text">
            <h1>VIDGRAB</h1>
          </div>
        </div>

        <nav className="desktop-nav">
          <a href="#" className="nav-link active">Home</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToFeatures() }} className="nav-link">Features</a>
          <button className="nav-link icon-only" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>
        </nav>

        {/* Mobile Settings Trigger */}
        <button className="mobile-menu-btn" onClick={() => setShowSettings(true)}>
          <Settings size={22} />
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="status-badge-pill">
            <span className={`dot ${connectionStatus}`}></span>
            {connectionStatus === 'connected' ? 'System Operational' : 'Connecting...'}
          </div>

          <h2 className="hero-title">Universal Video<br /><span className="highlight-text">Downloader</span></h2>
          <p className="hero-subtitle">High-speed downloads from thousands of sites. Now with smart link detection and enhanced privacy.</p>

          <div className="downloader-wrapper">

            {/* Tab Switcher */}
            <div className="main-tabs">
              <button
                className={`main-tab ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTab('video')}
              >
                <Video size={18} /> Video
              </button>
              <button
                className={`main-tab ${activeTab === 'audio' ? 'active' : ''}`}
                onClick={() => setActiveTab('audio')}
              >
                <Headphones size={18} /> Audio
              </button>
            </div>

            {/* Input Card */}
            <div className="input-card glass-panel glow-border">
              <form onSubmit={handleDownload}>
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    type="url"
                    className="hero-input"
                    placeholder="Paste link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                  <div className="input-actions">
                    {url && <button type="button" onClick={() => setUrl('')}><X size={18} /></button>}
                    <button type="button" className="paste-btn" onClick={handlePaste}>
                      <Clipboard size={18} /> <span className="hide-mobile">Paste</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'video' && (
                  <div className="quality-selector">
                    <span>Quality:</span>
                    <div className="quality-pills">
                      {['best', '1080', '720', '480'].map(q => (
                        <button
                          key={q}
                          type="button"
                          className={`q-pill ${quality === q ? 'selected' : ''}`}
                          onClick={() => setQuality(q)}
                        >
                          {q === 'best' ? 'Max' : q + 'p'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="action-area">
                  {!status || status.status !== 'ready' ? (
                    <button
                      type="submit"
                      className={`download-btn ${loading ? 'processing' : ''}`}
                      disabled={!url || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Download className="btn-icon" /> {activeTab === 'audio' ? 'Convert' : 'Download'}
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" className="download-btn success" disabled>
                      <CheckCircle className="btn-icon" /> Download Started!
                    </button>
                  )}
                </div>
              </form>

              {/* Live Status */}
              {status && (
                <div className={`live-status ${status.status}`}>
                  <div className="status-header">
                    <span className="status-label">
                      {status.status === 'downloading' && 'Downloading...'}
                      {status.status === 'queued' && 'Queued...'}
                      {status.status === 'error' && 'Failed'}
                      {status.status === 'ready' && 'Complete'}
                    </span>
                    {status.status === 'downloading' && <span className="status-percent">{status.progress.toFixed(0)}%</span>}
                  </div>

                  {status.status === 'downloading' && (
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${status.progress}%` }}></div>
                    </div>
                  )}

                  {status.message && <p className="status-msg">{status.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div >
      </section >

      {/* History Grid */}
      {
        history.length > 0 && (
          <section className="section history-grid-section">
            <div className="section-head">
              <h3><History size={18} /> Recent Downloads</h3>
            </div>
            <div className="downloads-grid">
              {history.map((item, i) => (
                <div key={i} className="download-item glass-panel" onClick={() => { setUrl(item.link); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  <div className="item-icon">
                    {item.type === 'audio' ? <Music /> : <FileVideo />}
                  </div>
                  <div className="item-details">
                    <h4>{item.filename}</h4>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* Feature Highlights */}
      <section className="section features-section" id="features" ref={featuresRef}>
        <div className="features-container">
          <div className="feature-box">
            <Zap className="f-icon" />
            <h4>Turbo Engine</h4>
            <p>Backend powered by high-performance servers for max speed.</p>
          </div>
          <div className="feature-box">
            <Shield className="f-icon" />
            <h4>Secure Core</h4>
            <p>No logs, no tracking. Your downloads are your business.</p>
          </div>
          <div className="feature-box">
            <Globe className="f-icon" />
            <h4>Universal</h4>
            <p>Supports 1000+ sites including xHamster, YouTube, Twitter.</p>
          </div>
        </div>
      </section>

      <footer className="simple-footer">
        <p>VidGrab &copy; 2026</p>
        <div className="socials">
          <Github size={18} />
          <Twitter size={18} />
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button className="mob-nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="mob-icon"><Video size={20} /></div>
          <span>Home</span>
        </button>
        <button className="mob-nav-item" onClick={() => {
          const el = document.querySelector('.history-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}>
          <div className="mob-icon"><History size={20} /></div>
          <span>History</span>
        </button>
        <button className="mob-nav-item" onClick={() => setShowSettings(true)}>
          <div className="mob-icon"><Settings size={20} /></div>
          <span>Settings</span>
        </button>
      </div>

      {/* Install Banner */}
      {
        showInstallBanner && (
          <div className="pwa-banner glass-panel slide-up">
            <div className="pwa-content">
              <Smartphone size={24} />
              <div>
                <strong>Install App</strong>
                <p>Add to home screen</p>
              </div>
            </div>
            <button className="install-btn" onClick={handleInstall}>Install Now</button>
          </div>
        )
      }

    </div >
  )
}

export default App
