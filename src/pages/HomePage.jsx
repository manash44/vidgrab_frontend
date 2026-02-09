import React from 'react'
import {
    Video,
    Headphones,
    X,
    Clipboard,
    Loader2,
    Download,
    CheckCircle,
    Zap,
    Shield,
    Globe,
    Server,
    ShieldCheck,
    Activity,
    Film,
    Music,
    Cpu
} from 'lucide-react'
import AdBanner from '../components/AdBanner'

const HomePage = ({
    connectionStatus,
    activeTab,
    setActiveTab,
    url,
    setUrl,
    loading,
    inputRef,
    handleDownload,
    handlePaste,
    handleSaveFile,
    quality,
    setQuality,
    status,
    featuresRef
}) => {
    return (
        <div className="page-container fade-in">
            {/* Main Layout */}
            <div className="home-layout">

                {/* Left Sidebar - Desktop Only */}
                <aside className="sidebar left-sidebar">
                    <div className="sidebar-card">
                        <div className="card-header">
                            <Server size={18} className="text-accent" />
                            <h3>Server Specs</h3>
                        </div>
                        <div className="stat-row">
                            <span>Status</span>
                            <span className="stat-value text-green">Online</span>
                        </div>
                        <div className="stat-row">
                            <span>Region</span>
                            <span className="stat-value">US-East</span>
                        </div>
                        <div className="stat-row">
                            <span>Uptime</span>
                            <span className="stat-value">99.9%</span>
                        </div>
                        <div className="stat-row">
                            <span>Load</span>
                            <span className="stat-value">12%</span>
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <div className="card-header">
                            <ShieldCheck size={18} className="text-accent" />
                            <h3>Supported Sites</h3>
                        </div>
                        <ul className="site-list">
                            <li><span className="dot-indicator red"></span> YouTube</li>
                            <li><span className="dot-indicator blue"></span> Twitter / X</li>
                            <li><span className="dot-indicator pink"></span> Instagram</li>
                            <li><span className="dot-indicator orange"></span> Reddit</li>
                            <li><span className="dot-indicator purple"></span> Twitch</li>
                            <li><span className="dot-indicator green"></span> +1000 More</li>
                        </ul>
                    </div>
                </aside>

                {/* Center Content */}
                <section className="hero-section center-content">
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
                                            <button type="button" className="download-btn success" onClick={handleSaveFile}>
                                                <CheckCircle className="btn-icon" />
                                                {status.message && status.message.includes('Started') ?
                                                    <span>Downloading... {status.fileSize && `(${status.fileSize})`}</span> :
                                                    'Click to Save File'}
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
                                            {(status.size || status.fileSize || status.file_size_str) && (
                                                <span className="status-size" style={{ marginLeft: 'auto', marginRight: '10px', opacity: 0.8, fontSize: '0.9em' }}>
                                                    {status.size || status.fileSize || status.file_size_str}
                                                </span>
                                            )}
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

                        {/* Ad Banner - Center */}
                        <AdBanner />
                    </div>
                </section>

                {/* Right Sidebar - Desktop Only */}
                < aside className="sidebar right-sidebar" >
                    <div className="sidebar-card">
                        <div className="card-header">
                            <Activity size={18} className="text-accent" />
                            <h3>Live Stats</h3>
                        </div>
                        <div className="stat-grid">
                            <div className="stat-item">
                                <Film size={16} />
                                <span className="stat-n">8.2K</span>
                                <span className="stat-l">Videos</span>
                            </div>
                            <div className="stat-item">
                                <Music size={16} />
                                <span className="stat-n">3.5K</span>
                                <span className="stat-l">Audio</span>
                            </div>
                            <div className="stat-item">
                                <Cpu size={16} />
                                <span className="stat-n">15ms</span>
                                <span className="stat-l">Latency</span>
                            </div>
                            <div className="stat-item">
                                <Globe size={16} />
                                <span className="stat-n">24/7</span>
                                <span className="stat-l">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card info-card">
                        <h4>Why use VidGetNow?</h4>
                        <p>We use advanced clustered servers to split files into chunks, maximizing your bandwidth for up to 5x faster downloads compared to browser standards.</p>
                        <div className="mini-feature">
                            <Zap size={14} className="text-accent" /> Lightning Fast
                        </div>
                    </div>

                    {/* Ad Banner - Right Sidebar */}
                    <AdBanner />
                </aside >

            </div >

            {/* Feature Highlights */}
            < section className="section features-section" id="features" ref={featuresRef} >
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
            </section >
        </div >
    )
}

export default HomePage
