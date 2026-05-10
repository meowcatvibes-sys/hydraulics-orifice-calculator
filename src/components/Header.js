import React from 'react';

function Header() {
  return (
    <header className="header" id="header">
      <div className="header-glow"></div>
      <h1 className="header-title">
        <span className="title-icon">💧</span>
        Orifice Time-to-Drain Calculator
      </h1>
      <p className="header-subtitle">Hydraulics Engineering Project — Multi-Layered Fluid Analysis</p>
      <div className="header-specs">
        <span className="spec-badge">Rectangular Box Container</span>
        <span className="spec-badge">1 / 2 / 3 Liquids</span>
        <span className="spec-badge">Bottom Orifice</span>
      </div>
    </header>
  );
}

export default Header;
