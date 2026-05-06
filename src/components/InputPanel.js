import React from 'react';

const LC = {
  liquid1:{dot:'#f59e0b',glow:'glow-liquid1'}, liquid2:{dot:'#3b82f6',glow:'glow-liquid2'},
  liquid3:{dot:'#f97316',glow:'glow-liquid3'}, water:{dot:'#3b82f6',glow:'glow-water'},
};

function InputPanel({ mode, layers, containerDiameter, setContainerDiameter, updateLayer }) {
  const h = (i,f) => e => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v>=0) updateLayer(i,f,v);
    else if (e.target.value==='') updateLayer(i,f,0);
  };
  const hd = e => { const v=parseFloat(e.target.value); if(!isNaN(v)&&v>=0) setContainerDiameter(v); else if(e.target.value==='') setContainerDiameter(0); };

  return (
    <div className="input-panel" id="input-panel">
      <h2 className="panel-title">⚙ {mode===1?'Liquid':'Layer'} Parameters</h2>
      <p className="panel-desc">{mode===1?'Set the head levels and container diameter':`Set height & SG of each of the ${mode} liquid layers`}</p>

      {layers.map((layer,i) => {
        const c = LC[layer.color] || LC.water;
        return (
          <div key={i} className="layer-group">
            <div className="layer-header">
              <div className="layer-dot" style={{background:c.dot,boxShadow:`0 0 8px ${c.dot}88`}}></div>
              <span className="layer-title">{layer.name}</span>
            </div>
            {mode === 1 ? (
              <>
                <div className="input-group">
                  <label htmlFor={`h1-${i}`}>h₁ (Initial Head)</label>
                  <div className={`input-wrapper ${c.glow}`}>
                    <input type="number" id={`h1-${i}`} min="0" step="0.1" value={layer.h1} onChange={h(i,'h1')} />
                    <span className="unit">m</span>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor={`h2-${i}`}>h₂ (Final Head)</label>
                  <div className={`input-wrapper ${c.glow}`}>
                    <input type="number" id={`h2-${i}`} min="0" step="0.1" value={layer.h2} onChange={h(i,'h2')} />
                    <span className="unit">m</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label htmlFor={`lh-${i}`}>Height (h<sub>{i+1}</sub>)</label>
                  <div className={`input-wrapper ${c.glow}`}>
                    <input type="number" id={`lh-${i}`} min="0" step="0.1" value={layer.height} onChange={h(i,'height')} />
                    <span className="unit">m</span>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor={`sg-${i}`}>Specific Gravity</label>
                  <div className={`input-wrapper ${c.glow}`}>
                    <input type="number" id={`sg-${i}`} min="0.01" step="0.01" value={layer.sg} onChange={h(i,'sg')} />
                    <span className="unit">SG</span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="input-group" style={{marginTop:'.5rem'}}>
        <div className="layer-header">
          <div className="layer-dot" style={{background:'#22d3ee',boxShadow:'0 0 8px #22d3ee88'}}></div>
          <span className="layer-title">Container</span>
        </div>
        <label htmlFor="container-diameter">Diameter of Cylinder</label>
        <div className="input-wrapper glow-side">
          <input type="number" id="container-diameter" min="0.1" step="0.1" value={containerDiameter} onChange={hd} />
          <span className="unit">m</span>
        </div>
        <span className="sg-info">Cylindrical cross-section (π/4 × D²)</span>
      </div>
    </div>
  );
}

export default InputPanel;
