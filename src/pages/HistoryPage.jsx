import React from 'react'
import { History, Music, FileVideo, Trash2, ChevronRight } from 'lucide-react'

const HistoryPage = ({ history, onSelect, onClear }) => {
  return (
    <div className="page-wrap fade-up">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div className="page-title" style={{marginBottom:0}}>
          <History size={20} /> Downloads
        </div>
        {history.length > 0 && (
          <button className="danger-btn" style={{ width:'auto', padding:'8px 14px' }} onClick={onClear}>
            <Trash2 size={14}/> Clear All
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="hist-list">
          {history.map((item, i) => (
            <div key={i} className="hist-item" onClick={() => onSelect(item.link)}>
              <div className="hist-icon">
                {item.type === 'audio' ? <Music size={20}/> : <FileVideo size={20}/>}
              </div>
              <div className="hist-info">
                <div className="hist-name">{item.filename || item.link}</div>
                <div className="hist-date">{item.date}</div>
              </div>
              <span className="hist-badge">{item.type === 'audio' ? 'MP3' : 'MP4'}</span>
              <ChevronRight size={16} style={{ color:'var(--muted)', flexShrink:0 }}/>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-box">
          <History size={52} style={{ opacity:.25 }}/>
          <p>No downloads yet</p>
          <p style={{ fontSize:'0.78rem' }}>Your download history will appear here</p>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
