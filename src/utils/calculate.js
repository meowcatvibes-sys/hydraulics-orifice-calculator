const g = 9.81;

export function calculateTime(liquidLayers, containerDiameter, orificeDiameter, C) {
  const As = (Math.PI / 4) * Math.pow(containerDiameter, 2);
  const Ao = (Math.PI / 4) * Math.pow(orificeDiameter, 2);
  const K = (2 * As) / (C * Ao * Math.sqrt(2 * g));
  const numLiquids = liquidLayers.length;

  // Layers: index 0 = top, last = bottom (closest to orifice)
  const layers = [...liquidLayers];

  if (numLiquids === 1) {
    const h1 = layers[0].h1; // initial head
    const h2 = layers[0].h2; // final head
    const time = K * (Math.sqrt(h1) - Math.sqrt(h2));
    return { mode:1, As, Ao, K, C, g, containerDiameter, orificeDiameter,
      layers, h1, h2, time, times:[time], cumulativeTimes:[time], totalTime:time };
  }

  if (numLiquids === 2) {
    const L1 = layers[0]; // top (lower SG)
    const L2 = layers[1]; // bottom (higher SG)
    const hNew1 = L2.height + L1.height * (L1.sg / L2.sg);
    const hNew2 = L1.height * (L1.sg / L2.sg);
    const t1 = K * (Math.sqrt(hNew1) - Math.sqrt(hNew2));
    const t2 = K * Math.sqrt(L1.height); // actual height when draining alone
    const cumT1 = t1;
    const cumT2 = t1 + t2;
    return { mode:2, As, Ao, K, C, g, containerDiameter, orificeDiameter,
      layers, hNew1, hNew2, t1, t2, times:[t1,t2],
      cumulativeTimes:[cumT1, cumT2], totalTime:cumT2 };
  }

  if (numLiquids === 3) {
    const L1 = layers[0]; // top
    const L2 = layers[1]; // middle
    const L3 = layers[2]; // bottom
    const hNew1 = L3.height + L2.height*(L2.sg/L3.sg) + L1.height*(L1.sg/L3.sg);
    const hNew1End = L2.height*(L2.sg/L3.sg) + L1.height*(L1.sg/L3.sg);
    const hNew2 = L2.height + L1.height*(L1.sg/L2.sg);
    const hNew2End = L1.height*(L1.sg/L2.sg);
    const t1 = K * (Math.sqrt(hNew1) - Math.sqrt(hNew1End));
    const t2 = K * (Math.sqrt(hNew2) - Math.sqrt(hNew2End));
    const t3 = K * Math.sqrt(L1.height);
    return { mode:3, As, Ao, K, C, g, containerDiameter, orificeDiameter,
      layers, hNew1, hNew1End, hNew2, hNew2End, t1, t2, t3,
      times:[t1,t2,t3], cumulativeTimes:[t1, t1+t2, t1+t2+t3],
      totalTime:t1+t2+t3 };
  }
  return null;
}
