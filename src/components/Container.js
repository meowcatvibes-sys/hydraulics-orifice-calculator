import React, { useState, useEffect, useRef } from 'react';

const STYLES = {
  liquid1: { front:'linear-gradient(180deg,#1565c0,#0d47a1 50%,#0a3d80)', side:'rgba(13,71,161,.45)', wave:'rgba(21,101,192,.7)' },
  liquid2: { front:'linear-gradient(180deg,#2e7d32,#1b5e20 50%,#145218)', side:'rgba(27,94,32,.45)', wave:'rgba(46,125,50,.7)' },
  liquid3: { front:'linear-gradient(180deg,#00acc1,#00838f 50%,#006064)', side:'rgba(0,131,143,.45)', wave:'rgba(0,172,193,.7)' },
  water:   { front:'linear-gradient(180deg,#2196f3,#1976d2 50%,#0d47a1)', side:'rgba(25,118,210,.45)', wave:'rgba(33,150,243,.7)' },
};
const MCOLORS = { liquid1:'#42a5f5', liquid2:'#66bb6a', liquid3:'#26c6da', water:'#42a5f5' };

function Container({ layers, mode, isDraining, drainDone }) {
  const [fillProgress, setFillProgress] = useState(0);
  const [drainProgress, setDrainProgress] = useState(0);
  const rafRef = useRef(null);

  // Fill animation from bottom to top when mode changes
  useEffect(() => {
    setFillProgress(0);
    setDrainProgress(0);
    let start = null;
    const duration = 1000;
    const animate = (ts) => {
      if (!start) start = ts;
      const raw = Math.min((ts - start) / duration, 1);
      // Ease out cubic for nice fill effect
      const eased = 1 - Math.pow(1 - raw, 3);
      setFillProgress(eased);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mode]);

  // Drain animation
  useEffect(() => {
    if (isDraining) {
      setDrainProgress(0);
      let start = null;
      const duration = 2600;
      const animate = (ts) => {
        if (!start) start = ts;
        const raw = Math.min((ts - start) / duration, 1);
        const eased = raw < 0.5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        setDrainProgress(eased);
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    } else if (drainDone) {
      // Refill smoothly
      let start = null;
      const refillDuration = 800;
      const animate = (ts) => {
        if (!start) start = ts;
        const raw = Math.min((ts - start) / refillDuration, 1);
        const eased = 1 - Math.pow(1 - raw, 3);
        setDrainProgress(1 - eased);
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }
  }, [isDraining, drainDone]);

  const total = layers.reduce((s, l) => s + (l.height || 0), 0);
  const max = Math.max(total, 0.1);

  // Each layer fills proportionally to 100% of the container
  const getLayerPct = (layer) => {
    const h = layer.height || 0;
    const basePct = (h / max) * 100; // percentage of total container
    // Apply fill progress (bottom to top) and drain progress
    const drainScale = isDraining ? Math.max(1 - drainProgress, 0) : (drainDone ? 1 - drainProgress : 1);
    return basePct * fillProgress * Math.max(drainScale, 0);
  };

  // Reverse for display: first item in flex = top visually
  const displayLayers = [...layers].reverse();

  return (
    <div className="container-visual" id="container-visual">
      {/* 3D Box container */}
      <div className={`box-container ${isDraining ? 'draining' : ''} ${drainDone ? 'drained' : ''}`}>
        {/* Right side face (3D depth) */}
        <div className="box-right-face">
          <div className="box-right-liq-stack">
            {displayLayers.map((layer, di) => {
              const pct = getLayerPct(layer);
              const style = STYLES[layer.color] || STYLES.water;
              return (
                <div key={di} className="box-right-liq"
                  style={{ height: `${pct}%`, background: style.side, opacity: pct > 0 ? 1 : 0 }}>
                </div>
              );
            })}
          </div>
        </div>

        {/* Front face (main view) */}
        <div className="box-front-face">
          <div className="box-glass-shine"></div>
          <div className="box-glass-shine-right"></div>
          <div className="box-liq-stack">
            {displayLayers.map((layer, di) => {
              const pct = getLayerPct(layer);
              const isTopVisual = di === 0;
              const style = STYLES[layer.color] || STYLES.water;
              return (
                <div key={di} className={`box-liq box-liq-${di}`}
                  style={{ height: `${pct}%`, background: style.front }}>
                  {isTopVisual && pct > 0 && (
                    <svg className="wave-svg" viewBox="0 0 200 8" preserveAspectRatio="none">
                      <path className="wave-path" style={{ stroke: style.wave }}
                        d="M0,4 C25,0 50,8 75,4 C100,0 125,8 150,4 C175,0 200,8 225,4" />
                    </svg>
                  )}
                  {pct > 5 && (
                    <div className="liq-label">
                      <span className="liq-name">{layer.name}</span>
                      <span className="liq-sg">SG={layer.sg}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="box-orifice"></div>
        </div>
      </div>

      {/* Pipe assembly */}
      <div className="pipe-assembly">
        <div className="pipe-connector"></div>
        <div className="pipe-vertical">
          {(isDraining || (drainDone && drainProgress > 0.5)) && (
            <div className="pipe-flow">
              <div className="pipe-drop pd1"></div>
              <div className="pipe-drop pd2"></div>
              <div className="pipe-drop pd3"></div>
            </div>
          )}
          {isDraining && <div className="pipe-stream"></div>}
        </div>
        <div className="pipe-end"></div>
        {isDraining && (
          <div className="pipe-splash-zone">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="splash-p" style={{
                '--a': `${(i / 10) * 360}deg`, '--d': `${8 + Math.random() * 16}px`,
                '--dl': `${Math.random() * 0.5}s`, '--sz': `${2 + Math.random() * 3}px`
              }}></div>
            ))}
            <div className="pipe-drip"></div>
          </div>
        )}
      </div>

      {/* Dimension lines on right side */}
      <div className="dim-container">
        {/* Main vertical line */}
        <div className="dim-vertical-line"></div>
        {/* Top tick */}
        <div className="dim-tick-h" style={{ top: '0' }}></div>
        {/* Bottom tick */}
        <div className="dim-tick-h" style={{ bottom: '0' }}></div>
        {/* Per-layer ticks and labels */}
        {layers.map((layer, i) => {
          const h = layer.height || 0;
          const pct = (h / max) * 100;
          // Bottom offset for this layer's bottom edge
          const bottomPct = layers.slice(0, i).reduce((s, l) => s + ((l.height || 0) / max) * 100, 0);
          return (
            <React.Fragment key={i}>
              {/* Tick at bottom of layer (skip for first layer, already have bottom tick) */}
              {i > 0 && (
                <div className="dim-tick-h" style={{ bottom: `${bottomPct}%` }}></div>
              )}
              {/* Height label centered on this layer */}
              <div className="dim-label"
                style={{ bottom: `${bottomPct}%`, height: `${pct}%` }}>
                <span className="dim-label-text" style={{ color: MCOLORS[layer.color] || '#42a5f5' }}>
                  {h.toFixed(0)} m
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Container;
