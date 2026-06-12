
// =====Voice FREQUENCY EFFECT FUNCTIONS ---Yujing Zhang =====//


let stars = [];
// ===== USER INPUT  =====
let personX = 0;      
let boatTilt = 0;         
let naturalRock = 0;     
let balanceScore = 100;   


// ===== SOUND MECHANIC — Anusha Jaiswal =====
let song, soundAnalyser;
let audioVolume = 0;
// ===== END SOUND MECHANIC VARIABLES =====


// ===== AUDIO FREQUENCY — Yujing Zhang =====
let fft;
let audioFrequency = 0;
let seagulls = [];
let rainDrops = [];
let seaParticles = [];
let particleSeaProgress = 0;
let meteors = [];

// ===== AUDIO FREQUENCY EFFECT — END =====


// ===== TIME MECHANIC =====
let currentPhase = "reality";
let phaseProgress = 0;
let phaseTimes = {
  reality:   { start: 0,     end: 15000 },
  dream:     { start: 15000, end: 35000 },
  galaxy:    { start: 35000, end: 55000 },
  awakening: { start: 55000, end: 70000 },
};
let timeline = [
  { time: 0,     event: "startReality" },
  { time: 5000,  event: "sunSetMoonRise" },
  { time: 15000, event: "startDream" },
  { time: 18000, event: "boatRise" },
  { time: 24000, event: "oceanDistort" },
  { time: 28000, event: "starsMove" },
  { time: 35000, event: "startGalaxy" },
  { time: 38000, event: "starsSwirl" },
  { time: 42000, event: "boatOrbit" },
  { time: 48000, event: "moonHalo" },
  { time: 55000, event: "startAwakening" },
  { time: 60000, event: "boatDrop" },
  { time: 65000, event: "oceanReturn" },
  { time: 70000, event: "loopToReality" },
];
let eventIndex = 0;
let timeOffset = 0;

// ===== SOUND MECHANIC — Anusha Jaiswal =====
function preload() {
  song = loadSound('assets/song.mp3');
}
// ===== END SOUND MECHANIC PRELOAD =====

let targetFloatAmount = 5;
let currentFloatAmount = 5;

function setup() {
  createCanvas(960, 540);
// ===== SOUND MECHANIC — Anusha Jaiswal =====
  soundAnalyser = new p5.Amplitude();
  soundAnalyser.setInput(song);
  // ===== END SOUND MECHANIC =====

  // Initialize stars with positions and flicker offset
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3),
      offset: random(TWO_PI)
    });
  }

  initFishSchool(10);// Innitilise fish school 
  
  // ===== AUDIO FREQUENCY  — Yujing Zhang  =====
  fft = new p5.FFT();
  fft.setInput(song);
  initSeagulls();
  initRain();
  initSeaParticles();
  // ===== AUDIO FREQUENCY  END =====
}

function draw() {
  // Get current time
  let now = millis() - timeOffset;

  // Calculate progress within the current phase
  let t = phaseTimes[currentPhase];
  phaseProgress = map(now, t.start, t.end, 0, 1);
  phaseProgress = constrain(phaseProgress, 0, 1);

  // Check and trigger timeline events
  let shouldBreak = false;
while (eventIndex < timeline.length && now >= timeline[eventIndex].time && !shouldBreak) {
  let eventName = timeline[eventIndex].event;
  handleEvent(eventName);
  eventIndex++;
  if (eventName === "loopToReality") {
    shouldBreak = true;
  }
}


  // ===== SOUND MECHANIC — Anusha Jaiswal =====
  if (soundAnalyser) {
    audioVolume = soundAnalyser.getLevel();
  }
  // ===== END SOUND MECHANIC =====

  drawSky(currentPhase);

  if (currentPhase === "reality") {
    drawSun(currentPhase);
  
  } else if (currentPhase === "dream") {
    drawMoon(currentPhase);
    drawStars(currentPhase);
    
  } else if (currentPhase === "galaxy") {
    drawStars(currentPhase);
    particleSeaProgress = constrain(particleSeaProgress + 0.003, 0, 1);
    updateMeteors();
    drawMeteors();
    
  } else {
    drawSun(currentPhase);
    
  }

  drawBackWave()

  updateWhale();   

  drawOcean(currentPhase);

  drawBoat(currentPhase);

  updateFishSchool(); 

  drawFrontWave();

  //  // ===== AUDIO FREQUENCY — Yujing Zhang =====
  updateFrequency();

  // reality phase
  if (currentPhase === "reality" || currentPhase === "awakening") {
    drawSeagulls();
    particleSeaProgress = 0; 
    meteors = [];
  }
 
  // dream part
  if (currentPhase === "dream") {
    particleSeaProgress = constrain(particleSeaProgress + 0.003, 0, 1);
    drawRain();
    drawParticleSea();
    meteors = [];
  }
  // galaxy part
  if (currentPhase === "galaxy") {
    particleSeaProgress = constrain(particleSeaProgress + 0.003, 0, 1);
  
  }
  // ======== AUDIO FREQUENCY  END ========

  // ===== SOUND MECHANIC — Anusha Jaiswal =====
  if (!song || !song.isPlaying()) {
    noStroke();
    fill(0, 0, 0, 120);
    rect(width/2 - 100, height - 35, 200, 24, 12);
    fill(255, 255, 255, 200);
    textSize(11);
    textAlign(CENTER);
    text("♪ click anywhere to start", width/2, height - 19);
  }
  // ===== END SOUND MECHANIC =====
}


// frequecy part 
function updateFrequency() {
  let spectrum = fft.analyze();
  let total = 0;
  for (let i = spectrum.length / 2; i < spectrum.length; i++) {
    total += spectrum[i];
  }
  audioFrequency = total / (spectrum.length / 2);
}

// seagulls part 
function initSeagulls() {
  for (let i = 0; i < 6; i++) {
    seagulls.push({
      x: random(50, width - 50),
      y: random(60, height / 2 - 80),
      speed: random(1, 3)
    });
  }
}
function drawSeagulls() {
  let frequencySpeed = map(audioFrequency, 50, 180, 0.8, 3);
  stroke(255); strokeWeight(2); noFill();
  for (let i = 0; i < seagulls.length; i++) {
    let bird = seagulls[i];
    bird.x -= bird.speed * frequencySpeed;
    if (bird.x < -30) {
      bird.x = width + 100;
      bird.y = random(60, height / 2 - 80);
    }
    let wingFlap = sin(frameCount * 0.02 * frequencySpeed) * 6;
    arc(bird.x - 10, bird.y, 20, 12 + wingFlap, PI, TWO_PI);
    arc(bird.x + 10, bird.y, 20, 12 + wingFlap, PI, TWO_PI);
  }
}

//  rain part 
function initRain() {
  for (let i = 0; i < 180; i++) {
    rainDrops.push({
      x: random(width), y: random(-height, 0),
      len: random(2, 10), speed: random(1, 3)
    });
  }
}
function drawRain() {
  let rainSpeed = map(audioFrequency, 50, 230, 1, 15);
  rainSpeed = constrain(rainSpeed, 1, 15);
  for (let i = 0; i < rainDrops.length; i++) {
    let r = rainDrops[i];
    let alpha = map(r.y, height / 2, height * 0.85, 220, 0);
    stroke(100, 220, 255, alpha * 0.35); strokeWeight(3);
    line(r.x, r.y, r.x, r.y + r.len);
    stroke(255, 255, 255, alpha); strokeWeight(1);
    line(r.x, r.y, r.x, r.y + r.len);
    r.y += r.speed + rainSpeed;
    if (r.y > height) { r.y = random(-height, 0); r.x = random(width); }
  }
}

// sea  sparkle particles 
function initSeaParticles() {
  for (let i = 0; i < 220; i++) {
    seaParticles.push({
      x: random(width), y: random(height * 2/3, height),
      size: random(1, 4), offset: random(TWO_PI)
    });
  }
}
function drawParticleSea() {
  noStroke();
  let visibleParticles = floor(seaParticles.length * particleSeaProgress);
  for (let i = 0; i < visibleParticles; i++) {
    let p = seaParticles[i];
    let glow = map(sin(frameCount * 0.03 + p.offset), -1, 1, 60, 180);
    fill(120, 220, 255, glow * particleSeaProgress);
    circle(p.x, p.y + sin(frameCount * 0.02 + p.offset) * 4, p.size + audioFrequency * 0.015);
  }
}

// meteor part 
function updateMeteors() {
  let spawnChance = map(audioFrequency, 0, 220, 0.008, 0.12);
  spawnChance = constrain(spawnChance, 0.008, 0.12);
  let spawnAttempts = floor(map(audioFrequency, 0, 220, 1, 4));
  spawnAttempts = constrain(spawnAttempts, 1, 4);
  let meteorColors = [
    { r: 120, g: 210, b: 255 },
    { r: 255, g: 90,  b: 90  },
    { r: 255, g: 220, b: 80  },
    { r: 255, g: 255, b: 255 }
  ];
  for (let i = 0; i < spawnAttempts; i++) {
    if (random(1) < spawnChance && meteors.length < 80) {
      let chosenColor = random(meteorColors);
      meteors.push({
        x: random(-50, width * 0.6),
        y: random(height * 0.05, height * 0.3),
        vx: random(2, 4),  
        vy: random(1, 2.2), 
        len: random(45, 90),
        alpha: 255,
        r: chosenColor.r,
        g: chosenColor.g,
        b: chosenColor.b
      });
    }
  }
  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    m.x += m.vx;
    m.y += m.vy;
    m.alpha -= 2.2;
    if (m.x > width + 200 || m.y > height / 2 + 100 || m.alpha <= 0) {
      meteors.splice(i, 1);
    }
  }
}
function drawMeteors() {
  for (let i = 0; i < meteors.length; i++) {
    let m = meteors[i];
    let tailX = m.x + m.len;
    let tailY = m.y + m.len * 0.45;

    stroke(m.r, m.g, m.b, m.alpha * 0.45);
    strokeWeight(4);
    line(m.x, m.y, tailX, tailY); 
    stroke(255, 255, 255, m.alpha * 0.9);
    strokeWeight(1.5);
    line(m.x, m.y, tailX, tailY);
    
    noStroke();
    // meteor light on tail 
    fill(m.r, m.g, m.b, m.alpha);
    circle(tailX, tailY, 5);
    fill(255, 255, 255, m.alpha);
    circle(tailX, tailY, 2.5);
  }
}
//===== Voice Frequency End======//
