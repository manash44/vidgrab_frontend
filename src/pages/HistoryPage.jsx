import React, { useState, useMemo } from 'react'
import {
  History, Music, FileVideo, Trash2, Search,
  ExternalLink, Copy, Check, Download, ArrowUpRight, Filter
} from 'lucide-react'

const HistoryPage = ({ history = [], onSelect, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all', 'video', 'audio'
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Compute metrics
  const totalCount = history.length
  const videoCount = history.filter(h => h.type !== 'audio').length
  const audioCount = history.filter(h => h.type === 'audio').length

  // Filtered items
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchType = typeFilter === 'all' ||
        (typeFilter === 'audio' && item.type === 'audio') ||
        (typeFilter === 'video' && item.type !== 'audio')

      const q = searchQuery.toLowerCase().trim()
      const matchQuery = !q ||
        (item.filename && item.filename.toLowerCase().includes(q)) ||
        (item.link && item.link.toLowerCase().includes(q))

      return matchType && matchQuery
    })
  }, [history, typeFilter, searchQuery])

  const handleCopy = (e, text, index) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1800)
  }

  return (
    <div className="page-wrap fade-up">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">
            <History size={26} color="var(--accent)" />
            <span>Downloads Manager</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Review, redownload, and organize your saved video and audio library.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            className="danger-btn"
            onClick={onClear}
            style={{ borderRadius: '12px' }}
          >
            <Trash2 size={15} />
            <span>Clear Library</span>
          </button>
        )}
      </div>

      {/* ── Stats Summary Bar ── */}
      {history.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <div className="status-card" style={{ padding: '18px 20px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Downloads
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text)', marginTop: '4px' }}>
              {totalCount}
            </div>
          </div>

          <div className="status-card" style={{ padding: '18px 20px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Video Files
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--accent)', marginTop: '4px' }}>
              {videoCount}
            </div>
          </div>

          <div className="status-card" style={{ padding: '18px 20px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Audio MP3s
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#8B5CF6', marginTop: '4px' }}>
              {audioCount}
            </div>
          </div>
        </div>
      )}

      {/* ── Search & Filter Controls ── */}
      {history.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            minWidth: '220px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '10px 16px',
            backdropFilter: 'blur(16px)'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search history by title or link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="fmt-toggle" style={{ margin: 0 }}>
            <button
              type="button"
              className={`fmt-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              className={`fmt-btn ${typeFilter === 'video' ? 'active' : ''}`}
              onClick={() => setTypeFilter('video')}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              Videos ({videoCount})
            </button>
            <button
              type="button"
              className={`fmt-btn ${typeFilter === 'audio' ? 'active' : ''}`}
              onClick={() => setTypeFilter('audio')}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              Audio ({audioCount})
            </button>
          </div>
        </div>
      )}

      {/* ── List / Items ── */}
      {filteredHistory.length > 0 ? (
        <div className="hist-list">
          {filteredHistory.map((item, i) => (
            <div
              key={i}
              className="hist-item"
              onClick={() => onSelect(item.link)}
              title="Click to reload this video in Downloader"
            >
              <div
                className="hist-icon"
                style={{
                  background: item.type === 'audio' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 42, 95, 0.12)',
                  color: item.type === 'audio' ? '#8B5CF6' : 'var(--accent)'
                }}
              >
                {item.type === 'audio' ? <Music size={22} /> : <FileVideo size={22} />}
              </div>

              <div className="hist-info">
                <div className="hist-name">
                  {item.filename || item.link}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="hist-date">{item.date}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.link}
                  </span>
                </div>
              </div>

              <span className="hist-badge">
                {item.type === 'audio' ? 'MP3' : 'MP4'}
              </span>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={(e) => handleCopy(e, item.link, i)}
                title="Copy Video Link"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '8px',
                  color: copiedIndex === i ? '#10B981' : 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
              </button>

              <button
                type="button"
                onClick={() => onSelect(item.link)}
                title="Redownload"
                style={{
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px var(--accent-glow)'
                }}
              >
                <ArrowUpRight size={14} />
                <span>Load</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-box">
          <History size={56} style={{ opacity: 0.3, color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
            {searchQuery ? 'No matching downloads found' : 'Your Download Library is Empty'}
          </h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto' }}>
            {searchQuery
              ? 'Try searching with a different term or clear the search filter above.'
              : 'Videos and MP3s you download will automatically appear here with quick reload actions.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => onSelect('')}
              style={{
                marginTop: '12px',
                background: 'var(--accent-gradient)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--accent-glow)'
              }}
            >
              Start Downloading
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
