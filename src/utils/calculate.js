const g = 9.81;

export function calculateTime(liquidLayers, length, width, orificeDiameter, C) {
  const As = length * width;
  const Ao = (Math.PI / 4) * Math.pow(orificeDiameter, 2);
  const K = (2 * As) / (C * Ao * Math.sqrt(2 * g));
  const n = liquidLayers.length;
  const layers = [...liquidLayers]; // index 0 = bottom (densest), last = top (lightest)

  if (n === 1) {
    const h = layers[0].height;
    const time = K * Math.sqrt(h);
    return { mode:1, As, Ao, K, C, g, length, width, orificeDiameter,
      layers, totalEquivHead: h, time, times:[time],
      cumulativeTimes:[time], totalTime:time };
  }

  // Reference SG = bottom liquid (densest)
  const sgRef = layers[0].sg;

  // Build remaining equivalent heads array
  // remaining[i] = equivalent head (in terms of sgRef) when layers 0..i-1 have drained
  // remaining[0] = total equiv head, remaining[n] = 0
  const remaining = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    remaining[i] = remaining[i + 1] + layers[i].height * (layers[i].sg / sgRef);
  }

  // Compute New Heights (equivalent heights for each layer in terms of sgRef)
  const newHeights = layers.map(l => l.height * (l.sg / sgRef));
  const totalEquivHead = remaining[0];

  // Time for each phase
  const times = [];
  const cumulativeTimes = [];
  let cumulative = 0;
  for (let i = 0; i < n; i++) {
    const t = K * (Math.sqrt(remaining[i]) - Math.sqrt(remaining[i + 1]));
    times.push(t);
    cumulative += t;
    cumulativeTimes.push(cumulative);
  }

  return {
    mode: n, As, Ao, K, C, g, length, width, orificeDiameter,
    layers, sgRef, remaining, newHeights, totalEquivHead,
    times, cumulativeTimes, totalTime: cumulative
  };
}
