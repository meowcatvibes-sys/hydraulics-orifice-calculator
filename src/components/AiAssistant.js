import React, { useState } from 'react';

function AiAssistant({ result, mode }) {
  const [open, setOpen] = useState(false);

  const getInsight = () => {
    if (!result) return "Hello! I'm Sir CJ, your hydraulics assistant. Set up your parameters and hit Calculate — I'll walk you through the results! 💧";
    if (result.mode === 1) {
      return `Great calculation! With a ${result.containerDiameter}m diameter cylinder and a ${(result.orificeDiameter*1000).toFixed(0)}mm orifice (C=${result.C}), it takes ${result.time.toFixed(3)} seconds to drain from h₁=${result.h1}m to h₂=${result.h2}m. The key factor K = ${result.K.toFixed(2)} determines how quickly the tank empties. A larger orifice or higher C would reduce drain time significantly.`;
    }
    if (result.mode === 2) {
      return `Two-liquid analysis complete! The bottom liquid (SG=${result.layers[1].sg}) drains first in ${result.cumulativeTimes[0].toFixed(3)}s. The equivalent head converts from ${result.hNew1.toFixed(1)}m down to ${result.hNew2.toFixed(1)}m. Total cumulative drain time is ${result.cumulativeTimes[1].toFixed(3)}s. Notice how the top liquid (SG=${result.layers[0].sg}) takes longer per meter because the driving pressure head is lower!`;
    }
    return `Three-liquid system analyzed! Bottom liquid (SG=${result.layers[2].sg}) drains first: cumulative Time₁ = ${result.cumulativeTimes[0].toFixed(3)}s. Middle liquid (SG=${result.layers[1].sg}): cumulative Time₂ = ${result.cumulativeTimes[1].toFixed(3)}s. Top liquid (SG=${result.layers[0].sg}): cumulative Time₃ = ${result.cumulativeTimes[2].toFixed(3)}s. Each segment uses equivalent head conversion to the draining liquid's SG.`;
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
