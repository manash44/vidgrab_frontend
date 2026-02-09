import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import {
  Settings,
  Bell,
  Wifi,
  AlertCircle,
  Trash2,
  Download,
  Github,
  Twitter,
  Smartphone,
  Video,
  History,
  X
} from 'lucide-react'
import './App.css'
import { APP_CONFIG } from './config'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'
import { SendIntent } from 'capacitor-plugin-send-intent'
import { App as CapacitorApp } from '@capacitor/app'
import { Clipboard as CapacitorClipboard } from '@capacitor/clipboard';

function App() {
  // Navigation State
  const [view, setView] = useState('home') // 'home' or 'history'

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

  const addToHistory = useCallback((link, filename, date) => {
    setHistory(prev => [{ link, filename, date, type: activeTab }, ...prev].slice(0, 20))
  }, [activeTab])

  const triggerDownload = useCallback((id) => {
    const downloadUrl = `${APP_CONFIG.backendUrl}/file/${id}`

    // Use window.location.assign for reliable file download trigger on mobile & desktop
    // This works because the backend should serve the file as an attachment.
    try {
      window.location.assign(downloadUrl)
    } catch (e) {
      console.error("Download trigger failed:", e)
      // Fallback
      window.open(downloadUrl, '_blank')
    }
  }, [])

  const handleAutoDownload = useCallback((id, filename, fileSize) => {
    triggerDownload(id)

    // Feedback: Update UI to show we triggered it
    setStatus({
      status: 'ready',
      message: 'Download Started - Check your files!',
      filename: filename,
      id: id,
      fileSize: fileSize
    })

    // Auto-clear logic to allow seamless next download
    // User requested: "after processing it should automatically download [and] I should don't have to pressed the button"
    // Also "when its properly clear then i can download new video"

    setTimeout(() => {
      // Only clear if status is still 'ready' (user hasn't started another download)
      setStatus(prev => (prev && prev.status === 'ready' ? null : prev))
      setTaskId(null)
      setUrl('')
    }, 4000) // 4 seconds to see "Ready" then auto-reset
  }, [triggerDownload])

  async function checkClipboard() {
    try {
      const { type, value } = await CapacitorClipboard.read();
      console.log(`Clipboard type: ${type}, value: ${value}`);
      if (value && (value.startsWith('http') || value.startsWith('www'))) {
        setUrl(value);
        // Optional: Auto-trigger download logic here if desired, 
        // but usually safest to just populate input for review
      }
    } catch (err) {
      console.log('Clipboard read failed (native) or not supported:', err);
      // Fallback for web
      try {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http') || text.startsWith('www'))) {
          setUrl(text);
        }
      } catch (e) { console.error(e) }
    }
  }

  async function checkIntent() {
    try {
      const result = await SendIntent.checkSendIntentReceived();
      if (result && result.url) {
        // result.url usually contains the shared text/link
        setUrl(result.url);
        // If shared, we might want to auto-show a modal or trigger simply
        // For now, setting URL is effective.
        // We can mimic "popup" behavior by setting view to 'home'
        setView('home');
      }
    } catch (err) {
      console.log('SendIntent plugin error:', err);
    }
  }

  // Check Backend
  async function checkConnection(setChecking = true) {
    if (setChecking) setConnectionStatus('checking')
    try {
      await axios.get(`${APP_CONFIG.backendUrl}/status/test`, { timeout: 8000 })
      setConnectionStatus('connected')
    } catch (error) {
      if (error.response) setConnectionStatus('connected')
      else setConnectionStatus('error')
    }
  }

  // Load/Save Settings
  function loadSettings() {
    const savedHistory = localStorage.getItem('vidgetnow_history')
    if (savedHistory) setHistory(JSON.parse(savedHistory))

    const savedAccent = localStorage.getItem('vidgetnow_accent')
    if (savedAccent) {
      setAccentColor(savedAccent)
      document.documentElement.setAttribute('data-theme', savedAccent)
    }
  }

  // Initialize
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkConnection(false)
    loadSettings()
    checkClipboard()
    checkIntent()

    // PWA Install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setTimeout(() => setShowInstallBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for future intents while app is open
    CapacitorApp.addListener('appUrlOpen', (data) => {
      // Fallback for deep links if needed
      console.log('App opened with URL:', data.url);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])



  const toggleAccent = (color) => {
    setAccentColor(color)
    localStorage.setItem('vidgetnow_accent', color)
    document.documentElement.setAttribute('data-theme', color)
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your download history?')) {
      setHistory([])
      localStorage.removeItem('vidgetnow_history')
    }
  }

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('vidgetnow_history', JSON.stringify(history))
    }
  }, [history])

  // Polling for Download Status
  useEffect(() => {
    if (taskId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${APP_CONFIG.backendUrl}/status/${taskId}`)
          const data = res.data
          if (data.status === 'ready') {
            clearInterval(pollIntervalRef.current)
            setLoading(false)

            addToHistory(url, data.filename || 'Download', new Date().toLocaleString())
            if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
              new Notification("Download Ready!", { body: data.filename })
            }
            handleAutoDownload(taskId, data.filename, data.file_size_str || data.size)
          } else if (data.status === 'error') {
            clearInterval(pollIntervalRef.current)
            setLoading(false)
            setStatus(data)
          } else {
            // Only update status if incorrectly 'ready' or other intermediate state
            setStatus(data)
          }
        } catch (err) {
          console.error("Polling error", err)
          // Determine if it's a 404 (Task Lost / Server Restart) or Network Error
          if (err.response && err.response.status === 404) {
            clearInterval(pollIntervalRef.current)
            setLoading(false)
            setStatus({
              status: 'error',
              message: 'Session timed out or server restarted. Please try again.'
            })
          } else {
            // Optional: count retries? For now just log. 
            // If completely offline, maybe show error? 
            // But transient network issues shouldn't break the UI immediately.
          }
        }
      }, 1000)
    }
    return () => pollIntervalRef.current && clearInterval(pollIntervalRef.current)
  }, [taskId, url, notificationsEnabled, addToHistory, handleAutoDownload])



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



  const handleSaveFile = () => {
    if (!status || status.status !== 'ready') return
    // Manual trigger if auto failed
    window.location.assign(`${APP_CONFIG.backendUrl}/file/${status.id}`)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      if (status?.status === 'ready') setStatus(null)
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
    if (view !== 'home') {
      setView('home')
      setTimeout(() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHistorySelect = (link) => {
    setUrl(link)
    setView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <small className="version-text">v2.1.0 • VidGetNow Core</small>
          </div>

        </div>
      </div>
      {showSettings && <div className="backdrop" onClick={() => setShowSettings(false)}></div>}

      {/* Header */}
      <header className="app-header glass-header">
        <div className="logo-container" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Download size={24} color="white" />
          </div>
          <div className="logo-text">
            <h1>VIDGETNOW</h1>
          </div>
        </div>

        <nav className="desktop-nav">
          <button className={`nav-link icon-only ${view === 'home' ? 'active-link' : ''}`} onClick={() => setView('home')}>Home</button>
          <button className={`nav-link icon-only ${view === 'history' ? 'active-link' : ''}`} onClick={() => setView('history')}>History</button>
          <button className={`nav-link icon-only ${view === 'about' ? 'active-link' : ''}`} onClick={() => setView('about')}>About</button>
          <button className="nav-link icon-only" onClick={scrollToFeatures}>Features</button>
          <button className="nav-link icon-only" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>
        </nav>

        {/* Mobile Settings Trigger */}
        <button className="mobile-menu-btn" onClick={() => setShowSettings(true)}>
          <Settings size={22} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {view === 'home' && (
          <HomePage
            connectionStatus={connectionStatus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            url={url}
            setUrl={(val) => {
              setUrl(val)
              if (status?.status === 'ready') setStatus(null)
            }}
            loading={loading}
            inputRef={inputRef}
            handleDownload={handleDownload}
            handlePaste={handlePaste}
            handleSaveFile={handleSaveFile}
            quality={quality}
            setQuality={setQuality}
            status={status}
            featuresRef={featuresRef}
          />
        )}

        {view === 'history' && (
          <HistoryPage
            history={history}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        )}

        {view === 'about' && <AboutPage />}
      </main>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-col footer-brand">
            <div className="logo-container" style={{ marginBottom: '10px' }}>
              <div className="logo-icon" style={{ width: '30px', height: '30px' }}>
                <Download size={18} color="white" />
              </div>
              <h2>VIDGETNOW</h2>
            </div>
            <p>The ultimate tool for downloading videos and audio from your favorite social platforms. Fast, free, and secure.</p>
          </div>

          <div className="footer-col">
            <h3>Navigation</h3>
            <div className="footer-links">
              <button className="footer-link nav-link icon-only" onClick={() => setView('home')}>Home</button>
              <button className="footer-link nav-link icon-only" onClick={() => setView('history')}>History</button>
              <button className="footer-link nav-link icon-only" onClick={() => setView('about')}>About Us</button>
            </div>
          </div>

          <div className="footer-col">
            <h3>Legal</h3>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">DMCA</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="#" className="social-icon"><Github size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="mailto:contact@vidgetnow.app" className="social-icon"><Settings size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} VidGetNow. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button className={`mob-nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
          <div className="mob-icon"><Video size={20} /></div>
          <span>Home</span>
        </button>
        <button className={`mob-nav-item ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <div className="mob-icon"><History size={20} /></div>
          <span>History</span>
        </button>
        <button className="mob-nav-item" onClick={() => setShowSettings(true)}>
          <div className="mob-icon"><Settings size={20} /></div>
          <span>Settings</span>
        </button>
      </div>

      {/* Install Banner */}
      {showInstallBanner && (
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
      )}

    </div>
  )
}

export default App
