import React from 'react';
import '../styles/AdminTabSwitcher.css';

const AdminTabSwitcher = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div className="admin-tab-switcher">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn ${currentTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AdminTabSwitcher;