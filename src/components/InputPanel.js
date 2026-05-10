import React from 'react';

const LC = {
  liquid1:{dot:'#42a5f5',glow:'glow-liquid1'}, liquid2:{dot:'#66bb6a',glow:'glow-liquid2'},
  liquid3:{dot:'#26c6da',glow:'glow-liquid3'}, water:{dot:'#42a5f5',glow:'glow-water'},
};

function InputPanel({ mode, layers, length, setLength, width, setWidth, updateLayer }) {
  const h = (i,f) => e => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v>=0) updateLayer(i,f,v);
    else if (e.target.value==='') updateLayer(i,f,0);
  };
  const hLen = e => { const v=parseFloat(e.target.value); if(!isNaN(v)&&v>=0) setLength(v); else if(e.target.value==='') setLength(0); };
  const hWid = e => { const v=parseFloat(e.target.value); if(!isNaN(v)&&v>=0) setWidth(v); else if(e.target.value==='') setWidth(0); };

  return (
    <div className="input-panel" id="input-panel">
      <h2 className="panel-title">⚙ {mode===1?'Liquid':'Layer'} Parameters</h2>
      <p className="panel-desc">{mode===1?'Set the height and container dimensions':`Set height & SG of each of the ${mode} liquid layers (bottom → top)`}</p>

      {layers.map((layer,i) => {
        const c = LC[layer.color] || LC.water;
        return (
          <div key={i} className="layer-group">
            <div className="layer-header">
              <div className="layer-dot" style={{background:c.dot,boxShadow:`0 0 8px ${c.dot}88`}}></div>
              <span className="layer-title">{layer.name} {mode>1 ? (i===0?'(Bottom)':i===layers.length-1?'(Top)':'(Middle)') : ''}</span>
            </div>
            <div className="input-group">
              <label htmlFor={`lh-${i}`}>Height (H<sub>{i+1}</sub>)</label>
              <div className={`input-wrapper ${c.glow}`}>
                <input type="number" id={`lh-${i}`} min="0" step="0.1" value={layer.height} onChange={h(i,'height')} />
                <span className="unit">m</span>
              </div>
            </div>
            {mode > 1 && (
              <div className="input-group">
                <label htmlFor={`sg-${i}`}>Specific Gravity (SG L<sub>{i+1}</sub>)</label>
                <div className={`input-wrapper ${c.glow}`}>
                  <input type="number" id={`sg-${i}`} min="0.01" step="0.01" value={layer.sg} onChange={h(i,'sg')} />
                  <span className="unit">SG</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="layer-group" style={{marginTop:'.5rem'}}>
        <div className="layer-header">
          <div className="layer-dot" style={{background:'#22d3ee',boxShadow:'0 0 8px #22d3ee88'}}></div>
          <span className="layer-title">Container (Box)</span>
        </div>
        <div className="input-group">
          <label htmlFor="container-length">Length</label>
          <div className="input-wrapper glow-side">
            <input type="number" id="container-length" min="0.1" step="0.1" value={length} onChange={hLen} />
            <span className="unit">m</span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="container-width">Width</label>
          <div className="input-wrapper glow-side">
            <input type="number" id="container-width" min="0.1" step="0.1" value={width} onChange={hWid} />
            <span className="unit">m</span>
          </div>
        </div>
        <span className="sg-info">A<sub>s</sub> = L × W = {(length * width).toFixed(3)} m²</span>
      </div>
    </div>
  );
}

export default InputPanel;
