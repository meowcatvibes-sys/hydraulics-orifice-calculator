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

  const drainLabels = (i) => {
    if (mode === 1) return 'Time';
    if (i === 0) return 'TIME TO DRAIN LIQUID 1';
    if (mode === 2 && i === 1) return 'TOTAL TIME TO DRAIN ALL LIQUID';
    if (mode === 3 && i === 1) return 'TIME TO DRAIN LIQUID 1 AND 2';
    if (mode === 3 && i === 2) return 'TOTAL TIME TO DRAIN ALL LIQUID';
    return `Phase ${i + 1}`;
  };

  return (
    <div className="result-box result-active" id="result-box">
      <div className="result-glow-border"></div>
      <div className="result-hero">
        <span className="result-tag">TOTAL TIME TO DRAIN ALL LIQUID</span>
        <div className="result-q">
          <span className="q-number">{result.totalTime.toFixed(3)}</span>
          <span className="q-unit">seconds</span>
        </div>
        <div className="result-q-alt">≈ {(result.totalTime / 60).toFixed(3)} minutes</div>
      </div>

      {mode > 1 && (
        <div className="time-breakdown">
          {result.cumulativeTimes.map((t, i) => (
            <div key={i} className="time-chip">
              <span className="time-chip-label">{drainLabels(i)}</span>
              <span className="time-chip-value">{t.toFixed(3)} s</span>
              <span className="time-chip-sub">{(t / 60).toFixed(3)} min</span>
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

        {/* Step 1: Given values */}
        <div className="step-card">
          <div className="step-num">1</div>
          <div className="step-body">
            <p className="step-desc">Given values:</p>
            {mode === 1 && <p className="step-eq">H₁ = {result.layers[0].height} m, SG = {result.layers[0].sg}</p>}
            {mode > 1 && result.layers.map((l, i) => (
              <p key={i} className="step-eq">H<sub>{i + 1}</sub> = {l.height} m, SG L<sub>{i + 1}</sub> = {l.sg} ({l.name} — {i === 0 ? 'Bottom' : i === result.layers.length - 1 ? 'Top' : 'Middle'})</p>
            ))}
            <p className="step-eq">Length = {result.length} m, Width = {result.width} m</p>
            <p className="step-eq">Diameter of A<sub>o</sub> = {result.orificeDiameter} m</p>
            <p className="step-eq">C = {result.C}</p>
            <p className="step-eq">g = {result.g} m/s²</p>
          </div>
        </div>

        {/* Step 2: Areas */}
        <div className="step-card">
          <div className="step-num">2</div>
          <div className="step-body">
            <p className="step-desc">Compute areas:</p>
            <p className="step-eq">A<sub>s</sub> = L × W = {result.length} × {result.width} = {result.As.toFixed(3)} m²</p>
            <p className="step-eq">A<sub>o</sub> = π/4 × ({result.orificeDiameter})² = {result.Ao.toFixed(10)} m²</p>
          </div>
        </div>

        {/* Step 3: Equivalent head (multi-liquid only) */}
        {mode >= 2 && (
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-body">
              <p className="step-desc">Equivalent head conversion (ref SG = {result.sgRef}):</p>
              {result.newHeights.map((nh, i) => (
                <p key={i} className="step-eq">
                  New H<sub>{i + 1}</sub> = H<sub>{i + 1}</sub> × (SG<sub>{i + 1}</sub>/SG<sub>ref</sub>) = {result.layers[i].height} × ({result.layers[i].sg}/{result.sgRef}) = {nh.toFixed(3)} m
                </p>
              ))}
              <p className="step-eq step-eq-gap" style={{ fontWeight: 700 }}>
                Total Equivalent Height = {result.newHeights.map(h => h.toFixed(3)).join(' + ')} = {result.totalEquivHead.toFixed(3)} m
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Calculate times */}
        <div className="step-card">
          <div className="step-num">{mode >= 2 ? 4 : 3}</div>
          <div className="step-body">
            <p className="step-desc">Calculate drain times:</p>
            {mode === 1 && <>
              <p className="step-eq">t = K × √H = K × √{result.layers[0].height}</p>
              <p className="step-result">Time = {result.time.toFixed(3)} s ({(result.time / 60).toFixed(3)} min)</p>
            </>}
            {mode > 1 && result.times.map((t, i) => (
              <div key={i} style={{ marginBottom: '.8rem' }}>
                <p className="step-eq">
                  Phase {i + 1}: K × (√{result.remaining[i].toFixed(3)} − √{result.remaining[i + 1].toFixed(3)})
                </p>
                <p className="step-result">
                  {drainLabels(i)} = {result.cumulativeTimes[i].toFixed(3)} s ({(result.cumulativeTimes[i] / 60).toFixed(3)} min)
                </p>
              </div>
            ))}
            <p className="step-eq step-eq-gap" style={{ marginTop: '.8rem' }}>
              K = 2A<sub>s</sub>/(CA<sub>o</sub>√2g) = {result.K.toFixed(3)}
            </p>
          </div>
        </div>

        <div className="constants-row">
          <div className="const-chip"><span>C</span> = {result.C}</div>
          <div className="const-chip"><span>Ø</span> = {(result.orificeDiameter * 1000).toFixed(0)} mm</div>
          <div className="const-chip"><span>L</span> = {result.length} m</div>
          <div className="const-chip"><span>W</span> = {result.width} m</div>
          <div className="const-chip"><span>A<sub>s</sub></span> = {result.As.toFixed(3)} m²</div>
          <div className="const-chip"><span>g</span> = {result.g} m/s²</div>
        </div>
      </div>
    </div>
  );
}

export default ResultBox;
