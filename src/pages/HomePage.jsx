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
    Globe
} from 'lucide-react'

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
                </div>
            </section>

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
        </div>
    )
}

export default HomePage
