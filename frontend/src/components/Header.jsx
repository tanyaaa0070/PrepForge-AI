import React from 'react';

/**
 * Header — Sticky app header with brand name and AI badge.
 */
export default function Header({ onReset }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand" onClick={onReset} style={{ cursor: 'pointer' }}>
          <div className="header__logo">⚡</div>
          <span className="header__title">PrepForge AI</span>
        </div>
        <span className="header__badge">AI Powered</span>
      </div>
    </header>
  );
}
