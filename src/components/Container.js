import React, { useState, useEffect } from 'react';

const STYLES = {
  liquid1: { front:'linear-gradient(180deg,#e6b422,#c99a18 50%,#a67c10)', side:'linear-gradient(180deg,#b8900e,#8a6b0a)', wave:'rgba(230,180,34,.7)' },
  liquid2: { front:'linear-gradient(180deg,#2196f3,#1976d2 50%,#0d47a1)', side:'linear-gradient(180deg,#1565c0,#0b3d91)', wave:'rgba(33,150,243,.7)' },
  liquid3: { front:'linear-gradient(180deg,#e8963a,#c47a20 50%,#9e5f15)', side:'linear-gradient(180deg,#b06918,#7a4a10)', wave:'rgba(232,150,58,.7)' },
  water: { front:'linear-gradient(180deg,#2196f3,#1976d2 50%,#0d47a1)', side:'linear-gradient(180deg,#1565c0,#0b3d91)', wave:'rgba(33,150,243,.7)' },
};
const MCOLORS = { liquid1:'#f59e0b', liquid2:'#60a5fa', liquid3:'#fb923c', water:'#60a5fa' };

function Container({ layers, mode, isDraining, drainDone }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { setFilled(false); const t=setTimeout(()=>setFilled(true),300); return ()=>clearTimeout(t); }, [layers.length]);

  const total = layers.reduce((s,l) => s + (l.height||l.h1||0), 0);
  const max = Math.max(total, 0.1);
  const display = [...layers].reverse();

  return (
    <div className="container-visual" id="container-visual">
      {/* Cylinder container */}
      <div className={`cylinder ${isDraining?'draining':''} ${drainDone?'drained':''} ${filled?'filled':'empty-start'}`}>
        {/* Top ellipse */}
        <div className="cyl-top-ellipse"></div>
        {/* Body */}
        <div className="cyl-body">
          <div className="cyl-glass-shine"></div>
          <div className="cyl-liq-stack">
            {display.map((layer, i) => {
              const h = layer.height || layer.h1 || 0;
              const pct = (h / max) * 100;
              const style = STYLES[layer.color] || STYLES.water;
              const isTop = i === display.length - 1;
              return (
                <div key={i} className={`cyl-liq cyl-liq-${i}`}
                  style={{ height: filled ? `${pct}%` : '0%', background: style.front }}>
                  {isTop && (
                    <svg className="wave-svg" viewBox="0 0 200 8" preserveAspectRatio="none">
                      <path className="wave-path" style={{stroke:style.wave}}
                        d="M0,4 C25,0 50,8 75,4 C100,0 125,8 150,4 C175,0 200,8 225,4" />
                    </svg>
                  )}
                  <div className="liq-label">
                    <span className="liq-name">{layer.name}</span>
                    <span className="liq-sg">SG={layer.sg}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Orifice at bottom center */}
          <div className="cyl-orifice"></div>
        </div>
        {/* Bottom ellipse */}
        <div className="cyl-bottom-ellipse"></div>
      </div>

      {/* Straight pipe going down */}
      <div className="pipe-assembly">
        <div className="pipe-connector"></div>
        <div className="pipe-vertical">
          {isDraining && (
            <div className="pipe-flow">
              <div className="pipe-drop pd1"></div>
              <div className="pipe-drop pd2"></div>
              <div className="pipe-drop pd3"></div>
            </div>
          )}
        </div>
        <div className="pipe-end"></div>
        {isDraining && (
          <div className="pipe-splash-zone">
            {Array.from({length:8},(_,i)=>(
              <div key={i} className="splash-p" style={{
                '--a':`${(i/8)*360}deg`,'--d':`${6+Math.random()*14}px`,
                '--dl':`${Math.random()*0.4}s`,'--sz':`${2+Math.random()*3}px`
              }}></div>
            ))}
            <div className="pipe-drip"></div>
          </div>
        )}
      </div>

      {/* Height markers */}
      <div className="markers">
        {display.map((layer, i) => {
          const h = layer.height || layer.h1 || 0;
          const pct = (h / max) * 100;
          return (
            <div key={i} className="mark" style={{height:`${pct}%`}}>
              <div className="mark-bracket"></div>
              <span className="mark-val" style={{color:MCOLORS[layer.color]||'#60a5fa'}}>
                {h.toFixed(1)} m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Container;
