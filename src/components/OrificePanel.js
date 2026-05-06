import React from 'react';

function OrificePanel({ orificeDia, coeff, setOrificeDia, setCoeff, onCalculate, isDraining }) {
  const h = (setter) => (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v >= 0) setter(v);
    else if (e.target.value === '') setter(0);
  };

  return (
    <div className="orifice-panel" id="orifice-panel">
      <h2 className="panel-title orifice-title">🔩 Orifice Parameters</h2>

      <div className="input-group">
        <div className="input-dot orifice-dot"></div>
        <label htmlFor="orifice-dia">Orifice Diameter</label>
        <div className="input-wrapper glow-orifice">
          <input type="number" id="orifice-dia" min="0.001" step="0.001" value={orificeDia} onChange={h(setOrificeDia)} />
          <span className="unit">m</span>
        </div>
        <span className="sg-info">e.g. 0.125 = 125 mm</span>
      </div>

      <div className="input-group">
        <div className="input-dot coeff-dot"></div>
        <label htmlFor="coeff-c">Coefficient of Discharge (C)</label>
        <div className="input-wrapper glow-coeff">
          <input type="number" id="coeff-c" min="0.01" max="1" step="0.01" value={coeff} onChange={h(setCoeff)} />
          <span className="unit">C</span>
        </div>
        <span className="sg-info">Typically 0.60 – 0.65</span>
      </div>

      <button className="calculate-btn" id="calculate-btn" onClick={onCalculate} disabled={isDraining}>
        {isDraining ? (
          <><span className="btn-spinner"></span> Draining...</>
        ) : (
          <><span className="btn-icon">⏱</span> Calculate Time to Drain</>
        )}
      </button>
    </div>
  );
}

export default OrificePanel;
