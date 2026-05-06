import React, { useState } from 'react';
import Header from './components/Header';
import Container from './components/Container';
import InputPanel from './components/InputPanel';
import OrificePanel from './components/OrificePanel';
import ResultBox from './components/ResultBox';
import AiAssistant from './components/AiAssistant';
import { calculateTime } from './utils/calculate';
import './App.css';

const PRESETS = {
  1: {
    layers: [{ name:'Water', sg:1.0, h1:3.0, h2:1.0, height:3.0, color:'water' }],
    containerDiameter:1.5, orificeDiameter:0.035, C:0.959,
  },
  2: {
    layers: [
      { name:'Liquid 1', sg:0.8, height:4.0, color:'liquid1' },
      { name:'Liquid 2', sg:1.0, height:6.0, color:'liquid2' },
    ],
    containerDiameter:1.5, orificeDiameter:0.035, C:0.959,
  },
  3: {
    layers: [
      { name:'Liquid 1', sg:0.85, height:0.5, color:'liquid1' },
      { name:'Liquid 2', sg:1.0, height:0.8, color:'liquid2' },
      { name:'Liquid 3', sg:1.75, height:1.0, color:'liquid3' },
    ],
    containerDiameter:2.0, orificeDiameter:0.019, C:0.983,
  },
};

function App() {
  const [mode, setMode] = useState(1);
  const [layers, setLayers] = useState(PRESETS[1].layers);
  const [containerDiameter, setContainerDiameter] = useState(1.5);
  const [orificeDiameter, setOrificeDiameter] = useState(0.035);
  const [coeff, setCoeff] = useState(0.959);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isDraining, setIsDraining] = useState(false);
  const [drainDone, setDrainDone] = useState(false);

  const handleModeChange = (m) => {
    setMode(m);
    const p = PRESETS[m];
    setLayers(p.layers.map(l=>({...l})));
    setContainerDiameter(p.containerDiameter);
    setOrificeDiameter(p.orificeDiameter);
    setCoeff(p.C);
    setResult(null); setShowResult(false); setDrainDone(false);
  };

  const updateLayer = (i, field, val) => {
    setLayers(prev => { const n=[...prev]; n[i]={...n[i],[field]:val}; return n; });
  };

  const handleCalculate = () => {
    if (isDraining) return;
    const res = calculateTime(layers, containerDiameter, orificeDiameter, coeff);
    setResult(res);
    setShowResult(false); setDrainDone(false); setIsDraining(true);
    setTimeout(() => {
      setIsDraining(false); setDrainDone(true); setShowResult(true);
      setTimeout(() => {
        const el = document.getElementById('result-box');
        if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 200);
    }, 2500);
  };

  return (
    <div className="app" id="app">
      <div className="bg-particles">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
      </div>
      <Header />
      <main className="main-content" id="main-content">
        <div className="mode-selector" id="mode-selector">
          {[1,2,3].map(m=>(
            <button key={m} className={`mode-btn ${mode===m?'mode-active':''}`}
              id={`mode-btn-${m}`} onClick={()=>handleModeChange(m)}>
              <span className="mode-count">{m}</span>
              <span className="mode-label">{m===1?'Liquid':'Liquids'}</span>
            </button>
          ))}
        </div>
        <div className="workspace">
          <div className="panels-col">
            <InputPanel mode={mode} layers={layers}
              containerDiameter={containerDiameter} setContainerDiameter={setContainerDiameter}
              updateLayer={updateLayer} />
            <OrificePanel orificeDia={orificeDiameter} coeff={coeff}
              setOrificeDia={setOrificeDiameter} setCoeff={setCoeff}
              onCalculate={handleCalculate} isDraining={isDraining} />
          </div>
          <Container layers={layers} mode={mode} isDraining={isDraining} drainDone={drainDone} />
        </div>
      </main>
      <section className={`result-section ${showResult?'result-animate':''}`} id="result-section">
        <ResultBox result={result} visible={showResult} />
      </section>
      <AiAssistant result={result} mode={mode} />
      <footer className="footer" id="footer">
        <p>Hydraulics Engineering — Orifice Flow Analysis</p>
      </footer>
    </div>
  );
}

export default App;
