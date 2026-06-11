// ============================================================
// Perlinnoise.js
// Perlin Noise & Randomness mechanic — Yichen Yao


// ============================================================
//  SHARED HELPERS
// ============================================================

// map a value from one range to another
function rangeMap(value, inMin, inMax, outMin, outMax) {
  let proportion = (value - inMin) / (inMax - inMin);
  return outMin + proportion * (outMax - outMin);
}

// draw one closed straight-edged polygon from a list of points.
function whaleFacet(pts) {
  beginShape();
  for (let i = 0; i < pts.length; i++) vertex(pts[i][0], pts[i][1]);
  endShape(CLOSE);
}


// ============================================================
//  PART 1 — FISH SCHOOL
// ============================================================
 
// The array holding every fish in the school
let fishSchool = [];
 
// Build a school of `count` random fish. Call once from main setup().
function initFishSchool(count) {
  fishSchool = [];
  for (let i = 0; i < count; i++) {
    fishSchool.push(new Fish());
  }
  // sort by depth, gives the school a front-to-back space.
  fishSchool.sort((a, b) => a.depth - b.depth);
}
 
// Update + draw every fish. Call each frame from main draw()
// Fish are sorted by depth so far-away fish draw first (behind) and near fish draw last (in front), reinforcing the z-depth illusion.
function updateFishSchool() {
  for (let f of fishSchool) {
    f.update();
    f.display();
  }
}
 
 
// ── Fish class ───────────────────────────────────────────────
class Fish {
  constructor() {
    this.waterTop    = height * 0.65;
    this.waterBottom = height * 0.96;
 
    // depth (z-axis): 0 = far away, 1 = close to the viewer 
    this.depth = random();
    let near = this.depth;        // weight for "near" (1 near, 0 far)
    let far  = 1 - this.depth;    
 
    // size: near fish bigger
    this.bodyLength = (30 + this.depth * 52) * random(0.85, 1.15);
 
    // colour: pick one of the four stage background colours at random, so the school always harmonises with whichever phase is showing.
    let palette = [
      { hue: 212, sat: 45, bri: 72 },   // reality   — mid blue
      { hue: 272, sat: 38, bri: 70 },   // dream     — violet
      { hue: 230, sat: 60, bri: 55 },   // galaxy    — deep blue
      { hue: 318, sat: 26, bri: 74 },   // awakening — greyish mauve
    ];
    let base = random(palette);
    // small per-fish variation, then fade far fish toward a muted background tone 
    const BG_SAT = 28, BG_BRI = 80;
    let baseHue = base.hue + random(-6, 6);
    let baseSat = base.sat + random(-8, 8);
    let baseBri = base.bri + random(-3, 10);
    this.hue = baseHue;
    this.sat = baseSat * near + BG_SAT * far;   
    this.bri = baseBri * near + BG_BRI * far;  
 
    // randome body shape 
    this.slimness = random(0.28, 0.55);
 
    // starting position
    this.x = random(width);
    this.laneCenter = random(this.waterTop, this.waterBottom);
    this.y = this.laneCenter;
    this.prevY = this.y;
    this.vy = 0;
 
    // vertical sine-wave bob (amplitude & period scale with size)
    this.amp    = rangeMap(this.bodyLength, 28, 95, 14, 32) * random(0.7, 1.3);
    this.period = rangeMap(this.bodyLength, 28, 95, 280, 620) * random(0.7, 1.6);
    this.phase  = random(TWO_PI);
 
    // horizontal swim: near fish (high depth) move faster, far slower.
    this.dir = random() > 0.5 ? 1 : -1;          // 1 right, -1 left
    this.hSpeed = (0.2 + this.depth * 0.8) * random(0.7, 1.3);
 
    // Perlin noise offset for lane drift
    this.noiseOff = random(1000);
  }
 
  update() {
    this.prevY = this.y;
 
    // advance the sine phase (slow, dreamy)
    this.phase += TWO_PI / this.period;
 
    // Perlin noise slowly drifts the swim lane up and down
    this.noiseOff += 0.004;
    let drift = noise(this.noiseOff);
    this.laneCenter += rangeMap(drift, 0, 1, -0.3, 0.3);
    // keep the lane inside the water band 
    if (this.laneCenter < this.waterTop)    this.laneCenter = this.waterTop;
    if (this.laneCenter > this.waterBottom) this.laneCenter = this.waterBottom;
 
    // final y = lane centre + gentle sine arc
    this.y = this.laneCenter + sin(this.phase) * this.amp;
    // hard safety clamp: never rise above the boat base, never leave the canvas
    if (this.y < this.waterTop) this.y = this.waterTop;
    if (this.y > height)        this.y = height;
 
    // vertical velocity — used to tilt the head along the path
    this.vy = this.y - this.prevY;
 
    // horizontal movement, wrapping at the edges
    this.x += this.dir * this.hSpeed;
    if (this.x >  width + this.bodyLength) this.x = -this.bodyLength;
    if (this.x < -this.bodyLength)         this.x =  width + this.bodyLength;
  }
 
  display() {
    let L = this.bodyLength;
    let H = this.bodyLength * this.slimness;
 
    push();
    colorMode(HSB, 360, 100, 100);
    translate(this.x, this.y);
    rotate(this.vy * 0.06 * this.dir);   // head leads along the path
    scale(this.dir, 1);                  // face left or right
    noStroke();
 
    let xNose =  L * 0.50, xHead = L * 0.30, xMid = L * 0.02;
    let xBack = -L * 0.34, xPed = -L * 0.52, xTail = -L * 0.78;
 
    // use delayed phase to make s-blend
    let sway = (vx) => {
      let backFrac = (L * 0.5 - vx) / (L * 0.5 - (-L * 0.78));
      if (backFrac < 0) backFrac = 0;
      if (backFrac > 1) backFrac = 1;
      return sin(this.phase * 2 - backFrac * 3) * (H * 0.22) * backFrac;
    };
 
    // fish body
    // lower body
    fill(this.hue, this.sat * 1.05, this.bri * 0.82);
    beginShape();
    vertex(xNose, 0        + sway(xNose));
    vertex(xHead, H * 0.30 + sway(xHead));
    vertex(xMid,  H * 0.48 + sway(xMid));
    vertex(xBack, H * 0.30 + sway(xBack));
    vertex(xPed,  H * 0.10 + sway(xPed));
    vertex(xPed,  0        + sway(xPed));
    endShape(CLOSE);
    // upper body
    fill(this.hue, this.sat * 0.85, min(this.bri * 1.04, 100));
    beginShape();
    vertex(xNose, 0        + sway(xNose));
    vertex(xHead, -H*0.34  + sway(xHead));
    vertex(xMid,  -H*0.52  + sway(xMid));
    vertex(xBack, -H*0.32  + sway(xBack));
    vertex(xPed,  -H*0.10  + sway(xPed));
    vertex(xPed,  0        + sway(xPed));
    endShape(CLOSE);
    // lower tail
    fill(this.hue, this.sat * 1.1, this.bri * 0.72);
    beginShape();
    vertex(xPed,  0        + sway(xPed));
    vertex(xPed,  H*0.10   + sway(xPed));
    vertex(xTail, H*0.40   + sway(xTail));
    vertex(xTail, H*0.06   + sway(xTail));
    endShape(CLOSE);
    // upper tail
    fill(this.hue, this.sat * 0.95, this.bri * 0.88);
    beginShape();
    vertex(xPed,  0        + sway(xPed));
    vertex(xPed,  -H*0.10  + sway(xPed));
    vertex(xTail, -H*0.42  + sway(xTail));
    vertex(xTail, -H*0.04  + sway(xTail));
    endShape(CLOSE);
    // dorsal fin
    fill(this.hue, this.sat * 0.7, min(this.bri * 1.08, 100));
    beginShape();
    vertex(L*0.05,  -H*0.50 + sway(L*0.05));
    vertex(-L*0.12, -H*0.78 + sway(-L*0.12));
    vertex(-L*0.20, -H*0.40 + sway(-L*0.20));
    endShape(CLOSE);
    // head accent
    fill(this.hue, this.sat * 0.6, min(this.bri * 1.10, 100));
    beginShape();
    vertex(xNose,     0       + sway(xNose));
    vertex(xHead,     -H*0.34 + sway(xHead));
    vertex(xHead*0.6, 0       + sway(xHead * 0.6));
    vertex(xHead,     H*0.30  + sway(xHead));
    endShape(CLOSE);
    // eye
    fill(this.hue, this.sat * 0.5, this.bri * 0.25);
    ellipse(L * 0.30, -H * 0.05 + sway(L * 0.30), L * 0.05, L * 0.05);
 
    pop();
  }
}
 
 
// ============================================================
//  PART 2 — Whale ( appear randomly and rarely)
// ============================================================
 
// How likely (per frame) a whale appears when none is on screen.
const WHALE_SPAWN_CHANCE = 0.001;
 
// The single active whale (null when none is on screen).
let whale = null;
 
// Spawn (rarely) + update + draw the whale
function updateWhale() {
  if (whale === null && random() < WHALE_SPAWN_CHANCE) {
    whale = new Whale();
  }
  if (whale !== null) {
    whale.update();
    whale.display();
    if (whale.done) whale = null;
  }
}
 
// ── Whale class ──────────────────────────────────────────────
class Whale {
  constructor() {
    this.t = 0;                          // progress 
    this.tStep = random(0.0030, 0.0042); // arc speed
    this.bodyLength = random(150, 200);
 
    this.travelDir = random() > 0.5 ? 1 : -1;   // direction
    let span = width * 0.70; //arc width
    let cx = width / 2;
    if (this.travelDir > 0) { this.startX = cx - span / 2; this.endX = cx + span / 2; }
    else { this.startX = cx + span / 2; this.endX = cx - span / 2; }
 
    this.baseY = height * 0.75;   // arc start/end 
    this.peakY = height * 0.35;   // arc peak 
    this.arc   = this.baseY - this.peakY;
 
    this.h = random([205, 212, 218]);   
    this.s = random(30, 42);
    this.b = random(70, 84);
 
    this.phase = random(TWO_PI);
    this.prevY = this.baseY;
    this.done = false;
  }
 
  update() {
     // speed( follow physical ruels)
    let heightNow = 4 * this.t * (1 - this.t);   // 0 at water, 1 at apex
    let speedFactor = 1 - heightNow * 0.55;      
    this.t += this.tStep * speedFactor;
    this.t += this.tStep;
    this.phase += 0.03;          // slow tail beat
    if (this.t >= 1) this.done = true;
  }
 
  display() {
    let t = this.t;
    let x = this.startX + (this.endX - this.startX) * t;
    let y = this.baseY - this.arc * (4 * t * (1 - t));   // parabola
 
    let vy = y - this.prevY;
    this.prevY = y;
    let tilt = vy * 0.05 * this.travelDir;
 
    push();
    translate(x, y);
    rotate(tilt);
    if (this.travelDir > 0) scale(-1, 1);   // face right when moving right
    drawWhale(0, 0, this.bodyLength, this.h, this.s, this.b, this.phase);
    pop();
  }
}
 
// drawWhale: faceted whale with S-shape delayed-phase sway 
function drawWhale(x, y, bodyLength, h, s, b, phase) {
  const headX = -1.00, tailX = 1.06;
  const SWAY_AMP = 0.13;
 
  function sway(vx) {
    let backFrac = (vx - headX) / (tailX - headX);
    if (backFrac < 0) backFrac = 0;
    if (backFrac > 1) backFrac = 1;
    return sin(phase - backFrac * 3) * SWAY_AMP * backFrac;
  }
  function sw(pt) { return [pt[0], pt[1] + sway(pt[0])]; }
 
  const tailTop = -0.04, tailBot = 0.04;
  let D  = [[-0.78,-0.20],[-0.46,-0.30],[-0.10,-0.30],[0.28,-0.25],[0.60,-0.16],[0.88, tailTop]];
  let U  = [[-0.95,-0.06],[-0.46,-0.17],[-0.10,-0.18],[0.28,-0.14],[0.60,-0.08],[0.88, tailBot]];
  let M  = [[-1.00, 0.08],[-0.46,-0.02],[-0.10,-0.02],[0.28,-0.01],[0.60, 0.00],[0.88, tailBot]];
  let Lc = [[-0.88, 0.24],[-0.46, 0.30],[-0.10, 0.28],[0.28, 0.20],[0.60, 0.10],[0.88, tailBot]];
  D = D.map(sw); U = U.map(sw); M = M.map(sw); Lc = Lc.map(sw);
 
  const HUBx = 1.06, HUBy = 0.01;
  const HUB = [HUBx, HUBy + sway(HUBx)];
  const AXIS = 0.32;
  const tailWag = sin(phase - 3) * 0.28;
 
  const leafLen = 0.58, leafW = 0.45;
  const tmpl = [[0.00,0.04],[0.35,0.55],[0.85,0.95],[0.92,0.65],[0.60,0.25],[0.15,0.00]];
  function leafLocal(side) {
    let out = [];
    for (let i = 0; i < tmpl.length; i++) out.push([tmpl[i][0]*leafLen, tmpl[i][1]*leafW*side]);
    return out;
  }
  const FUP = leafLocal(-1), FLO = leafLocal(1);
  const PA=[0.00,0.14], PB=[0.14,0.15], PC=[0.30,0.38],
        PD=[0.27,0.47], PE=[0.14,0.44], PF=[0.04,0.30];
 
  push();
  colorMode(HSB, 360, 100, 100);
  translate(x, y);
  scale(bodyLength);
  noStroke();
 
  fill(h, s, b);
  whaleFacet([D[0],D[1],D[2],D[3],D[4],D[5], U[5],U[4],U[3],U[2],U[1],U[0]]);
  fill(h, s * 0.62, min(100, b * 1.12));
  whaleFacet([U[0],U[1],U[2],U[3],U[4],U[5], M[5],M[4],M[3],M[2],M[1],M[0]]);
  fill(h + 2, s * 0.26, min(100, b * 1.34));
  whaleFacet([M[0],M[1],M[2],M[3],M[4],M[5], Lc[5],Lc[4],Lc[3],Lc[2],Lc[1],Lc[0]]);
 
  fill(h, s, b);
  whaleFacet([D[5], HUB, Lc[5]]);
 
  push();
  translate(HUB[0], HUB[1]);
  rotate(AXIS + tailWag);
  fill(h, s, b);
  whaleFacet(FUP);
  whaleFacet(FLO);
  pop();
 
  fill(h, s * 0.85, b * 0.82);
  whaleFacet([PA,PB,PC,PD,PE,PF]);
  fill(h, s, b * 0.72);
  whaleFacet([PB,PC,PD]);
 
  let eyePt = sw([-0.62, -0.04]);
  fill(h, min(100, s * 0.70), b * 0.30);
  const er = 0.03;
  beginShape();
  for (let i = 0; i < 6; i++) {
    vertex(eyePt[0] + cos(i * PI / 3) * er, eyePt[1] + sin(i * PI / 3) * er);
  }
  endShape(CLOSE);
 
  pop();
}

//addition: decolarations to make the fish harmonise in the ocean 

function drawBackWave() {
  let r, g, b;
  if (typeof currentPhase !== "undefined" && currentPhase === "dream") {
    r = 155;  g = 120;  b = 190;
  } else if (typeof currentPhase !== "undefined" && currentPhase === "galaxy") {
    r = 18;  g = 20;  b = 64;
  } else if (typeof currentPhase !== "undefined" && currentPhase === "awakening") {
    r = 175;  g = 140;  b = 180;
  } else {
    r = 110;  g = 140;  b = 185;   // reality (and fallback)
  }
 
  // --- tweak these ---
  let backTop = height * 0.5;    // water-line height of this wave
  let amp     = 30;              // wave height 
  let speed   = 0.040;           // flow speed 
  let freq    = 0.012;           // wavelength 
  let offset  = 2.0;             // out of sync with the front wave
  let alpha    = 95;             // transparency of the wave band
  
  push();
  colorMode(RGB, 255);
  noStroke();
  fill(r, g, b, alpha);                 // opaque
  beginShape();
  for (let x = 0; x <= width; x += 8) {
    let wy = backTop + sin(frameCount * speed + x * freq + offset) * amp;
    vertex(x, wy);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  pop();
}
 
 
// drawFrontWave: semi-transparent wave in front of the fish ──
function drawFrontWave() {
  // a slightly different colour per phase (matches the ocean's deep tone)
  let r, g, b;
  if (typeof currentPhase !== "undefined" && currentPhase === "dream") {
    r = 80;  g = 60;  b = 130;
  } else if (typeof currentPhase !== "undefined" && currentPhase === "galaxy") {
    r = 18;  g = 20;  b = 64;
  } else if (typeof currentPhase !== "undefined" && currentPhase === "awakening") {
    r = 95;  g = 95;  b = 145;
  } else {
    r = 55;  g = 78;  b = 128;   // reality (and fallback)
  }
 
  // --- tweak these ---
  let frontTop = height * 0.700;  // vertical position of the wave crest
  let amp      = 14;             // wave height
  let speed    = 0.025;          // how fast it flows
  let freq     = 0.012;          // wavelength
  let alpha    = 85;             // transparency of the wave band
 
  push();
  colorMode(RGB, 255);
  noStroke();
 
  // filled wave band
  fill(r, g, b, alpha);
  beginShape();
  for (let x = 0; x <= width; x += 8) {
    let wy = frontTop + sin(frameCount * speed + x * freq) * amp;
    vertex(x, wy);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
 
  // soft white foam highlight along the crest
  noFill();
  stroke(255, 255, 255, 55);
  strokeWeight(1.5);
  beginShape();
  for (let x = 0; x <= width; x += 8) {
    let wy = frontTop + sin(frameCount * speed + x * freq) * amp;
    vertex(x, wy);
  }
  endShape();
 
  pop();
}