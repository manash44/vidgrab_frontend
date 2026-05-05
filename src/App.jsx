import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import axios from 'axios'
import {
  Settings, Bell, Trash2, Download,
  Video, History, X, Wifi, WifiOff
} from 'lucide-react'
import './App.css'
import { APP_CONFIG } from './config'
const HomePage    = lazy(() => import('./pages/HomePage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const AboutPage   = lazy(() => import('./pages/AboutPage'))
import { SendIntent } from 'capacitor-plugin-send-intent'
import { App as CapacitorApp } from '@capacitor/app'
import { Clipboard as CapacitorClipboard } from '@capacitor/clipboard'

const ACCENT_MAP = {
  yellow: '#ffd700',
  red:    '#ff3b5c',
  blue:   '#3b82f6',
  green:  '#22c55e',
  purple: '#a855f7',
}

function App() {
  const [view,       setView]       = useState('home')
  const [activeTab,  setActiveTab]  = useState('video')
  const [url,        setUrl]        = useState('')
  const [quality,    setQuality]    = useState('best')
  const [loading,    setLoading]    = useState(false)
  const [status,     setStatus]     = useState(null)
  const [taskId,     setTaskId]     = useState(null)
  const [history,    setHistory]    = useState([])

  const [showSettings,          setShowSettings]          = useState(false)
  const [notificationsEnabled,  setNotificationsEnabled]  = useState(true)
  const [accentColor,           setAccentColor]           = useState('yellow')
  const [connectionStatus,      setConnectionStatus]      = useState('checking')

  const pollRef   = useRef(null)
  const inputRef  = useRef(null)
  const featRef   = useRef(null)

  // ── Helpers ─────────────────────────────────────
  const addToHistory = useCallback((link, filename, date) => {
    setHistory(prev => [{ link, filename, date, type: activeTab }, ...prev].slice(0, 30))
  }, [activeTab])

  const triggerDownload = useCallback((id) => {
    const dlUrl = `${APP_CONFIG.backendUrl}/file/${id}`
    try {
      const a = document.createElement('a')
      a.href = dlUrl; a.setAttribute('download', '')
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    } catch {
      window.location.assign(dlUrl)
    }
  }, [])

  const handleAutoDownload = useCallback((id, filename, fileSize) => {
    triggerDownload(id)
    setStatus({ status:'ready', message:'Download Started… tap Save if it didn\'t start.', filename, id, fileSize })
  }, [triggerDownload])

  // ── Capacitor ───────────────────────────────────
  async function checkClipboard() {
    try {
      const { value } = await CapacitorClipboard.read()
      if (value?.startsWith('http') || value?.startsWith('www')) {
        setUrl(value); setStatus(null); setTaskId(null)
      }
    } catch {
      try {
        const text = await navigator.clipboard.readText()
        if (text?.startsWith('http') || text?.startsWith('www')) {
          setUrl(text); setStatus(null); setTaskId(null)
        }
      } catch {}
    }
  }

  async function checkIntent() {
    try {
      const result = await SendIntent.checkSendIntentReceived()
      if (result?.url) { setUrl(result.url); setStatus(null); setTaskId(null); setView('home') }
    } catch {}
  }

  // ── Connection ──────────────────────────────────
  async function checkConnection(retryCount = 0) {
    if (retryCount === 0) setConnectionStatus('checking')
    try {
      await axios.get(`${APP_CONFIG.backendUrl}/status/test`, { timeout: 10000 })
      setConnectionStatus('connected')
    } catch (err) {
      if (!err.response && retryCount < 6) {
        setConnectionStatus('waking')
        setTimeout(() => checkConnection(retryCount + 1), 8000)
      } else {
        setConnectionStatus('error')
      }
    }
  }

  useEffect(() => {
    // Keep backend alive while page is open
    const keepAlive = setInterval(() => {
      axios.get(`${APP_CONFIG.backendUrl}/status/test`).catch(() => {})
    }, 600000) // 10 minutes
    return () => clearInterval(keepAlive)
  }, [])

  // ── Settings persist ────────────────────────────
  function loadSettings() {
    const h = localStorage.getItem('vgn_history')
    if (h) setHistory(JSON.parse(h))
    const a = localStorage.getItem('vgn_accent') || 'yellow'
    setAccentColor(a)
    document.documentElement.setAttribute('data-theme', a)
  }

  function toggleAccent(color) {
    setAccentColor(color)
    localStorage.setItem('vgn_accent', color)
    document.documentElement.setAttribute('data-theme', color)
  }

  function clearHistory() {
    if (confirm('Clear all download history?')) {
      setHistory([]); localStorage.removeItem('vgn_history')
    }
  }

  // ── Init ────────────────────────────────────────
  useEffect(() => {
    checkConnection(); loadSettings(); checkClipboard(); checkIntent()
    CapacitorApp.addListener('appUrlOpen', () => {})
  }, [])

  useEffect(() => {
    if (history.length > 0) localStorage.setItem('vgn_history', JSON.stringify(history))
  }, [history])

  // ── Polling ─────────────────────────────────────
  useEffect(() => {
    if (!taskId) return
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${APP_CONFIG.backendUrl}/status/${taskId}`)
        if (data.status === 'ready') {
          clearInterval(pollRef.current); setLoading(false)
          addToHistory(url, data.filename || 'Download', new Date().toLocaleString())
          if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            try { new Notification('Download Ready!', { body: data.filename }) } catch {}
          }
          handleAutoDownload(taskId, data.filename, data.file_size_str || data.size)
        } else if (data.status === 'error') {
          clearInterval(pollRef.current); setLoading(false); setStatus(data)
        } else {
          setStatus(data)
        }
      } catch (err) {
        if (err.response?.status === 404) {
          clearInterval(pollRef.current); setLoading(false)
          setStatus({ status:'error', message:'Session lost. Please try again.' })
        }
      }
    }, 1000)
    return () => clearInterval(pollRef.current)
  }, [taskId, url, notificationsEnabled, addToHistory, handleAutoDownload])

  // ── Actions ─────────────────────────────────────
  const handleDownload = async (e) => {
    e.preventDefault()
    if (!url) return
    setLoading(true); setStatus({ status:'queued', message:'Initiating…' }); setTaskId(null)
    try {
      const res = await axios.post(`${APP_CONFIG.backendUrl}/download`, {
        url, format: activeTab, quality: activeTab === 'audio' ? 'best' : quality
      }, { timeout: 60000 })
      setTaskId(res.data.task_id)
      if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
    } catch (err) {
      setStatus({ status:'error', message: err.response?.data?.message || 'Failed to start download.' })
      setLoading(false)
    }
  }

  const handleSaveFile = () => {
    if (status?.status === 'ready') triggerDownload(status.id)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text); setStatus(null); setTaskId(null); inputRef.current?.focus()
    } catch {}
  }

  const handleHistorySelect = (link) => {
    setUrl(link); setStatus(null); setTaskId(null); setView('home')
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  // ── Render ──────────────────────────────────────
  return (
    <div className="app-wrap">

      {/* ── Top Bar ── */}
      <header className="top-bar">
        <div className="top-bar-logo" onClick={() => setView('home')}>
          <div className="logo-pill">
            <Download size={18}/>
          </div>
          <span>VidGetNow</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {/* Desktop nav */}
          <div className="desktop-nav-items">
            {['home','history','about'].map(v => (
              <button key={v} className={`desktop-nav-btn ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            <Settings size={18}/>
          </button>
        </div>
      </header>

      {/* ── Main scroll ── */}
      <main className="main-scroll">
        <Suspense fallback={
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0', color:'var(--muted)' }}>
            Loading…
          </div>
        }>
          {view === 'home' && (
            <HomePage
              connectionStatus={connectionStatus}
              activeTab={activeTab} setActiveTab={setActiveTab}
              url={url} setUrl={(v) => { setUrl(v); setStatus(null); setTaskId(null) }}
              loading={loading} inputRef={inputRef}
              handleDownload={handleDownload}
              handlePaste={handlePaste}
              handleSaveFile={handleSaveFile}
              quality={quality} setQuality={setQuality}
              status={status} featuresRef={featRef}
            />
          )}
          {view === 'history' && (
            <HistoryPage history={history} onSelect={handleHistorySelect} onClear={clearHistory}/>
          )}
          {view === 'about' && <AboutPage/>}
        </Suspense>
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <button className={`nav-tab ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
          <div className="nav-icon"><Video size={20}/></div>
          Home
        </button>
        <button className={`nav-tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <div className="nav-icon"><History size={20}/></div>
          Downloads
        </button>
        <button className="nav-tab" onClick={() => setShowSettings(true)}>
          <div className="nav-icon"><Settings size={20}/></div>
          Settings
        </button>
      </nav>

      {/* ── Settings Drawer ── */}
      {showSettings && <div className="drawer-overlay" onClick={() => setShowSettings(false)}/>}
      <div className={`settings-drawer ${showSettings ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>Settings</h3>
          <button className="icon-btn" onClick={() => setShowSettings(false)}><X size={18}/></button>
        </div>
        <div className="drawer-body">

          <div className="setting-group">
            <label>Theme Color</label>
            <div className="color-row">
              {Object.entries(ACCENT_MAP).map(([k, v]) => (
                <button
                  key={k}
                  className={`color-swatch ${accentColor === k ? 'active' : ''}`}
                  style={{ background: v }}
                  onClick={() => toggleAccent(k)}
                />
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Notifications</label>
            <div className="toggle-row">
              <span>Download alerts</span>
              <div className={`toggle ${notificationsEnabled ? 'on' : ''}`} onClick={() => setNotificationsEnabled(!notificationsEnabled)}/>
            </div>
          </div>

          <div className="setting-group">
            <label>Data</label>
            <button className="danger-btn" onClick={clearHistory}>
              <Trash2 size={16}/> Clear Download History
            </button>
          </div>

          <div className="setting-group">
            <label>Connection</label>
            <div className="conn-row">
              <div className={`conn-dot ${connectionStatus}`}/>
              <span>{connectionStatus === 'connected' ? 'Backend Online' : 'Backend Offline'}</span>
            </div>
            <button
              style={{ background:'none', border:'1px solid var(--border)', borderRadius:10, padding:'9px 14px', color:'var(--muted)', cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:6 }}
              onClick={checkConnection}
            >
              <Wifi size={14}/> Test Connection
            </button>
          </div>

          <div className="version-tag" style={{ textAlign:'left', padding:0 }}>
            VidGetNow Premium v2.2.0 • Render Backend
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
