import React from 'react';

function ResultBox({ result, visible }) {
  if (!visible || !result) {
    return (
      <div className="result-box result-empty" id="result-box">
        <div className="empty-state">
          <span className="empty-icon">⏱</span>
          <p>Enter values and press <strong>Calculate Time to Drain</strong></p>
        </div>
      </div>
    );
  }
  const { mode } = result;

  return (
    <div className="result-box result-active" id="result-box">
      <div className="result-glow-border"></div>
      <div className="result-hero">
        <span className="result-tag">TOTAL TIME TO DRAIN</span>
        <div className="result-q">
          <span className="q-number">{result.totalTime.toFixed(3)}</span>
          <span className="q-unit">seconds</span>
        </div>
        <div className="result-q-alt">≈ {(result.totalTime/60).toFixed(3)} minutes</div>
      </div>

      {mode > 1 && (
        <div className="time-breakdown">
          {result.cumulativeTimes.map((t,i) => (
            <div key={i} className="time-chip">
              <span className="time-chip-label">Time<sub>{i+1}</sub></span>
              <span className="time-chip-value">{t.toFixed(3)} s</span>
            </div>
          ))}
        </div>
      )}

      <div className="solution">
        <h3 className="solution-title">📋 Step-by-Step Solution</h3>
        <div className="formula-row">
          <span className="formula-label">Formula:</span>
          <span className="formula-eq">t = (2A<sub>s</sub>) / (CA<sub>o</sub>√2g) × (√h₁ − √h₂)</span>
        </div>

        <div className="step-card">
          <div className="step-num">1</div>
          <div className="step-body">
            <p className="step-desc">Given values:</p>
            {mode===1 && <><p className="step-eq">h₁ = {result.h1} m, h₂ = {result.h2} m</p></>}
            {mode>1 && result.layers.map((l,i)=>(<p key={i} className="step-eq">SG<sub>{i+1}</sub> = {l.sg}, h<sub>{i+1}</sub> = {l.height} m ({l.name})</p>))}
            <p className="step-eq">D<sub>cyl</sub> = {result.containerDiameter} m, D<sub>orifice</sub> = {result.orificeDiameter} m ({(result.orificeDiameter*1000).toFixed(0)} mm)</p>
            <p className="step-eq">C = C<sub>v</sub> = {result.C}</p>
          </div>
        </div>

        <div className="step-card">
          <div className="step-num">2</div>
          <div className="step-body">
            <p className="step-desc">Compute areas:</p>
            <p className="step-eq">A<sub>s</sub> = π/4 × ({result.containerDiameter})² = {result.As.toFixed(4)} m²</p>
            <p className="step-eq">A<sub>o</sub> = π/4 × ({result.orificeDiameter})² = {result.Ao.toFixed(6)} m²</p>
          </div>
        </div>

        {mode >= 2 && (
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-body">
              <p className="step-desc">Equivalent head conversion:</p>
              {mode===2 && <>
                <p className="step-eq">h<sub>new1</sub> = h₂ + h₁(SG₁/SG₂) = {result.hNew1.toFixed(1)} m</p>
                <p className="step-eq">h<sub>new2</sub> = h₁(SG₁/SG₂) = {result.hNew2.toFixed(1)} m</p>
              </>}
              {mode===3 && <>
                <p className="step-eq">h<sub>new1</sub> = h₃ + h₂(SG₂/SG₃) + h₁(SG₁/SG₃) = {result.hNew1.toFixed(1)} m</p>
                <p className="step-eq">h<sub>new1,end</sub> = h₂(SG₂/SG₃) + h₁(SG₁/SG₃) = {result.hNew1End.toFixed(1)} m</p>
                <p className="step-eq">h<sub>new2</sub> = h₂ + h₁(SG₁/SG₂) = {result.hNew2.toFixed(3)} m</p>
                <p className="step-eq">h<sub>new2,end</sub> = h₁(SG₁/SG₂) = {result.hNew2End.toFixed(3)} m</p>
              </>}
            </div>
          </div>
        )}

        <div className="step-card">
          <div className="step-num">{mode>=2?4:3}</div>
          <div className="step-body">
            <p className="step-desc">Calculate time{mode>1?'s (cumulative)':''}:</p>
            {mode===1 && <>
              <p className="step-eq">t = K × (√{result.h1} − √{result.h2})</p>
              <p className="step-result">t = {result.time.toFixed(3)} s</p>
            </>}
            {mode===2 && <>
              <p className="step-eq">Time₁ = K × (√{result.hNew1.toFixed(1)} − √{result.hNew2.toFixed(1)})</p>
              <p className="step-result">Time₁ = {result.cumulativeTimes[0].toFixed(3)} s</p>
              <p className="step-eq step-eq-gap">Segment₂ = K × √{result.layers[0].height}</p>
              <p className="step-result">Time₂ = {result.cumulativeTimes[1].toFixed(3)} s (cumulative)</p>
            </>}
            {mode===3 && <>
              <p className="step-eq">Time₁ = K × (√{result.hNew1.toFixed(1)} − √{result.hNew1End.toFixed(1)})</p>
              <p className="step-result">Time₁ = {result.cumulativeTimes[0].toFixed(3)} s</p>
              <p className="step-eq step-eq-gap">Segment₂ = K × (√{result.hNew2.toFixed(3)} − √{result.hNew2End.toFixed(3)})</p>
              <p className="step-result">Time₂ = {result.cumulativeTimes[1].toFixed(3)} s (cumulative)</p>
              <p className="step-eq step-eq-gap">Segment₃ = K × √{result.layers[0].height}</p>
              <p className="step-result">Time₃ = {result.cumulativeTimes[2].toFixed(3)} s (cumulative)</p>
            </>}
            <p className="step-eq step-eq-gap" style={{marginTop:'.8rem'}}>K = 2A<sub>s</sub>/(CA<sub>o</sub>√2g) = {result.K.toFixed(3)}</p>
          </div>
        </div>

        <div className="constants-row">
          <div className="const-chip"><span>C</span> = {result.C}</div>
          <div className="const-chip"><span>Ø</span> = {(result.orificeDiameter*1000).toFixed(0)} mm</div>
          <div className="const-chip"><span>D</span> = {result.containerDiameter} m</div>
          <div className="const-chip"><span>g</span> = {result.g} m/s²</div>
        </div>
      </div>
    </div>
  );
}

export default ResultBox;
