import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import axios from 'axios'
import {
  Settings, Bell, Trash2, Download,
  Video, History, X, Wifi, WifiOff, Sun, Moon
} from 'lucide-react'
import './App.css'
import Sidebar from './components/Sidebar'
import { APP_CONFIG } from './config'
const HomePage    = lazy(() => import('./pages/HomePage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const AboutPage   = lazy(() => import('./pages/AboutPage'))
const SettingsPage= lazy(() => import('./pages/SettingsPage'))
import { SendIntent } from 'capacitor-plugin-send-intent'
import { App as CapacitorApp } from '@capacitor/app'
import { Clipboard as CapacitorClipboard } from '@capacitor/clipboard'

function App() {
  const [view,       setView]       = useState('home')
  const [activeTab,  setActiveTab]  = useState('video')
  const [urls,       setUrls]       = useState('')
  const [quality,    setQuality]    = useState('1080')
  const [loading,    setLoading]    = useState(false)
  const [tasks,      setTasks]      = useState({})
  const [history,    setHistory]    = useState([])

  const [notificationsEnabled,  setNotificationsEnabled]  = useState(true)
  const [theme,                 setTheme]                 = useState('dark')
  const [connectionStatus,      setConnectionStatus]      = useState('checking')

  const pollRef   = useRef(null)
  const inputRef  = useRef(null)
  const featRef   = useRef(null)

  const apiUrl = useCallback((path) => {
    const base = APP_CONFIG.backendUrl.replace(/\/$/, '')
    return `${base}${path}`
  }, [])

  const normalizeUrl = useCallback((value) => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }, [])

  // ── Helpers ─────────────────────────────────────
  const addToHistory = useCallback((link, filename, date) => {
    setHistory(prev => [{ link, filename, date, type: activeTab }, ...prev].slice(0, 30))
  }, [activeTab])

  const triggerDownload = useCallback((id) => {
    const dlUrl = apiUrl(`/file/${id}`)
    try {
      const a = document.createElement('a')
      a.href = dlUrl; a.setAttribute('download', '')
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    } catch {
      window.location.assign(dlUrl)
    }
  }, [apiUrl])

  const handleAutoDownload = useCallback((id, filename, fileSize) => {
    triggerDownload(id)
    setStatus({ status:'ready', message:"Download started. Tap Save if it didn't start.", filename, id, fileSize })
  }, [triggerDownload])

  // ── Capacitor ───────────────────────────────────
  async function checkClipboard() {
    try {
      const { value } = await CapacitorClipboard.read()
      if (value?.startsWith('http') || value?.startsWith('www')) {
        setUrls(value)
      }
    } catch {
      try {
        const text = await navigator.clipboard.readText()
        if (text?.startsWith('http') || text?.startsWith('www')) {
          setUrls(text)
        }
      } catch {}
    }
  }

  async function checkIntent() {
    try {
      const result = await SendIntent.checkSendIntentReceived()
      if (result?.url) { setUrls(result.url); setView('home') }
    } catch {}
  }

  // ── Connection ──────────────────────────────────
  async function checkConnection(retryCount = 0) {
    if (retryCount === 0) setConnectionStatus('checking')
    try {
      await axios.get(apiUrl('/status/test'), { timeout: 10000 })
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
      axios.get(apiUrl('/status/test')).catch(() => {})
    }, 600000) // 10 minutes
    return () => clearInterval(keepAlive)
  }, [apiUrl])

  // ── Settings persist ────────────────────────────
  function loadSettings() {
    const h = localStorage.getItem('vgn_history')
    if (h) setHistory(JSON.parse(h))
    const t = localStorage.getItem('vgn_theme') || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
    const q = localStorage.getItem('vgn_quality') || '1080'
    setQuality(q)
  }

  useEffect(() => {
    localStorage.setItem('vgn_quality', quality)
  }, [quality])

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('vgn_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
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
    const activeTids = Object.keys(tasks).filter(tid => !tid.startsWith('err_') && ['queued', 'downloading'].includes(tasks[tid]?.status))
    if (activeTids.length === 0) return

    pollRef.current = setInterval(async () => {
      let changed = false
      const newTasks = { ...tasks }
      
      for (const tid of activeTids) {
        try {
          const { data } = await axios.get(apiUrl(`/status/${tid}`))
          
          if (data.status !== newTasks[tid].status || data.progress !== newTasks[tid].progress || data.message !== newTasks[tid].message) {
            newTasks[tid] = { ...newTasks[tid], ...data }
            changed = true
          }
          
          if (data.status === 'ready' && tasks[tid]?.status !== 'ready') {
            addToHistory(newTasks[tid].url, data.filename || 'Download', new Date().toLocaleString())
            if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
              try { new Notification('Download Ready!', { body: data.filename }) } catch {}
            }
            handleAutoDownload(tid, data.filename, data.file_size_str || data.size)
          }
        } catch (err) {
          if (err.response?.status === 404) {
            newTasks[tid] = { ...newTasks[tid], status: 'error', message: 'Session lost. Please try again.' }
            changed = true
          }
        }
      }
      if (changed) setTasks(newTasks)
    }, 1000)
    
    return () => clearInterval(pollRef.current)
  }, [tasks, notificationsEnabled, addToHistory, handleAutoDownload, apiUrl])

  // ── Actions ─────────────────────────────────────
  const handleDownload = async (e) => {
    e.preventDefault()
    if (!urls.trim()) return
    const links = urls.split('\n').map(l => l.trim()).filter(Boolean)
    if (links.length === 0) return
    
    setLoading(true)
    let newTasks = { ...tasks }
    
    const promises = links.map(async (link) => {
      const downloadUrl = normalizeUrl(link)
      try {
        const res = await axios.post(apiUrl('/download'), {
          url: downloadUrl, format: activeTab, quality: activeTab === 'audio' ? 'best' : quality
        }, { timeout: 60000 })
        const tid = res.data.task_id
        newTasks[tid] = { status: 'queued', message: 'Starting download...', url: downloadUrl }
      } catch (err) {
        const fakeId = 'err_' + Date.now() + Math.random()
        newTasks[fakeId] = { status: 'error', message: err.response?.data?.message || err.response?.data?.error || 'Failed to start download.', url: downloadUrl }
      }
    })
    
    await Promise.all(promises)
    setTasks(newTasks)
    setLoading(false)
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }

  const handleSaveFile = (tid) => {
    triggerDownload(tid)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrls(prev => prev ? prev + '\n' + text : text)
      inputRef.current?.focus()
    } catch {}
  }

  const handleHistorySelect = (link) => {
    setUrls(link); setView('home')
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  // ── Render ──────────────────────────────────────
  return (
    <div className="app-container">
      {/* ── Animated Background ── */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Sidebar currentView={view} setView={setView} />
      <div className="content-area">
        {/* ── Top Bar ── */}
        <header className="top-bar">
          <div className="top-bar-logo" onClick={() => setView('home')}>
            <div className="logo-pill">
              <Download size={18}/>
            </div>
            <span>VidGetNow</span>
          </div>
          <div className="theme-toggle-pill" onClick={toggleTheme}>
            <div className={`theme-indicator ${theme === 'light' ? 'light' : 'dark'}`} />
            <span className={theme === 'light' ? 'active' : ''}><Sun size={14}/> Light</span>
            <span className={theme === 'dark' ? 'active' : ''}><Moon size={14}/> Dark</span>
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
                urls={urls} setUrls={setUrls}
                loading={loading} inputRef={inputRef}
                handleDownload={handleDownload}
                handlePaste={handlePaste}
                handleSaveFile={handleSaveFile}
                quality={quality} setQuality={setQuality}
                tasks={tasks} clearTasks={() => setTasks({})}
              />
            )}
            {view === 'history' && (
              <HistoryPage history={history} onSelect={handleHistorySelect} onClear={clearHistory}/>
            )}
            {view === 'about' && <AboutPage/>}
            {view === 'settings' && (
              <SettingsPage 
                theme={theme} toggleTheme={toggleTheme}
                quality={quality} setQuality={setQuality}
                notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled}
                clearHistory={clearHistory}
                connectionStatus={connectionStatus} checkConnection={checkConnection}
              />
            )}
          </Suspense>
        </main>

        {/* ── Bottom Nav (mobile only) ── */}
        <nav className="bottom-nav">
          <button className={`nav-tab ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
            <div className="nav-icon"><Video size={20}/></div>
            Home
          </button>
          <button className={`nav-tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
            <div className="nav-icon"><History size={20}/></div>
            Downloads
          </button>
          <button className={`nav-tab ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
            <div className="nav-icon"><Settings size={20}/></div>
            Settings
          </button>
        </nav>
      </div>

    </div>
  )
}

export default App
