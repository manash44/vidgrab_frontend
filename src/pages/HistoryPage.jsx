import React from 'react'
import { History, Music, FileVideo, Trash2 } from 'lucide-react'

const HistoryPage = ({ history, onSelect, onClear }) => {
    return (
        <div className="page-container fade-in">
            <section className="section history-grid-section">
                <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3><History size={18} /> Download History</h3>
                    {history.length > 0 && (
                        <button className="danger-btn small" onClick={onClear} style={{ width: 'auto', padding: '8px 12px' }}>
                            <Trash2 size={14} /> Clear
                        </button>
                    )}
                </div>

                {history.length > 0 ? (
                    <div className="downloads-grid">
                        {history.map((item, i) => (
                            <div key={i} className="download-item glass-panel" onClick={() => onSelect(item.link)}>
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
                ) : (
                    <div className="empty-history">
                        <History size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No downloads yet.</p>
                        <p className="sub-text">Your download history will appear here.</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default HistoryPage
