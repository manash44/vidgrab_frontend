import React from 'react';
import { Video, History, Info, Settings, Download, Sparkles } from 'lucide-react';
import './Sidebar.css';

const NavItem = ({ label, icon: Icon, active, onClick, badge }) => (
  <button
    className={`sidebar-item ${active ? 'active' : ''}`}
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    <div className="sidebar-item-icon">
      <Icon size={21} />
    </div>
    <span className="sidebar-label">{label}</span>
    {badge ? <span className="sidebar-badge">{badge}</span> : null}
  </button>
);

const Sidebar = ({ currentView, setView }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-area" onClick={() => setView('home')}>
        <div className="sidebar-logo-icon">
          <Download size={22} />
        </div>
        <span className="sidebar-logo-text">VidGetNow</span>
      </div>

      <nav className="sidebar-nav-list">
        <NavItem
          label="Downloader"
          icon={Video}
          active={currentView === 'home'}
          onClick={() => setView('home')}
        />
        <NavItem
          label="Downloads"
          icon={History}
          active={currentView === 'history'}
          onClick={() => setView('history')}
        />
        <NavItem
          label="Features"
          icon={Info}
          active={currentView === 'about'}
          onClick={() => setView('about')}
        />
        <NavItem
          label="Settings"
          icon={Settings}
          active={currentView === 'settings'}
          onClick={() => setView('settings')}
        />
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-pro-pill">
          <Sparkles size={14} />
          <span>v2.2.1 Pro</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
