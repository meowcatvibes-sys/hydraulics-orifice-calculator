import React, { useState } from 'react';

function AiAssistant({ result, mode }) {
  const [open, setOpen] = useState(false);

  const getInsight = () => {
    if (!result) return "Hello! I'm Sir CJ, your hydraulics assistant. Set up your parameters and hit Calculate — I'll walk you through the results! 💧";
    if (result.mode === 1) {
      return `With a ${result.length}m × ${result.width}m box (As=${result.As.toFixed(3)} m²) and a ${(result.orificeDiameter*1000).toFixed(0)}mm orifice (C=${result.C}), it takes ${result.time.toFixed(3)}s (${(result.time/60).toFixed(3)} min) to drain. K = ${result.K.toFixed(2)}.`;
    }
    const n = result.mode;
    let msg = `${n}-liquid analysis complete! `;
    result.cumulativeTimes.forEach((t, i) => {
      const label = i === 0 ? 'Drain Liquid 1' : i === n-1 ? 'Total drain' : `Drain Liquids 1-${i+1}`;
      msg += `${label}: ${t.toFixed(3)}s. `;
    });
    return msg;
  };

  return (
    <>
      <button className={`ai-toggle ${open?'ai-toggle-open':''}`} onClick={()=>setOpen(!open)} id="ai-toggle">
        <span className="ai-toggle-icon">{open ? '✕' : '🤖'}</span>
      </button>
      <div className={`ai-panel ${open?'ai-open':''}`} id="ai-panel">
        <div className="ai-header">
          <div className="ai-avatar">🤖</div>
          <div>
            <div className="ai-name">Sir CJ</div>
            <div className="ai-role">AI Hydraulics Assistant</div>
          </div>
        </div>
        <div className="ai-body">
          <div className="ai-bubble">
            <p>{getInsight()}</p>
          </div>
          {result && (
            <div className="ai-stats">
              <div className="ai-stat">
                <span className="ai-stat-label">Mode</span>
                <span className="ai-stat-val">{result.mode} Liquid{result.mode>1?'s':''}</span>
              </div>
              <div className="ai-stat">
                <span className="ai-stat-label">Container</span>
                <span className="ai-stat-val">{result.length}m × {result.width}m Box</span>
              </div>
              <div className="ai-stat">
                <span className="ai-stat-label">K Factor</span>
                <span className="ai-stat-val">{result.K.toFixed(2)}</span>
              </div>
              <div className="ai-stat">
                <span className="ai-stat-label">Total Time</span>
                <span className="ai-stat-val">{result.totalTime.toFixed(3)}s</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AiAssistant;
