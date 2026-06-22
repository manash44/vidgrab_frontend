import React from 'react';
import { Video, History, Info, Settings } from 'lucide-react';
import './Sidebar.css';

const NavItem = ({ label, icon: Icon, active, onClick }) => (
  <button
    className={`sidebar-item ${active ? 'active' : ''}`}
    onClick={onClick}
    aria-label={label}
  >
    <Icon size={20} />
    <span className="sidebar-label">{label}</span>
  </button>
);

const Sidebar = ({ currentView, setView }) => {
  return (
    <nav className="sidebar">
      <NavItem
        label="Home"
        icon={Video}
        active={currentView === 'home'}
        onClick={() => setView('home')}
      />
      <NavItem
        label="History"
        icon={History}
        active={currentView === 'history'}
        onClick={() => setView('history')}
      />
      <NavItem
        label="About"
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
  );
};

export default Sidebar;
