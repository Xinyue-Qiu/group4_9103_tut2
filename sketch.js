// IDEA9103 Group Project — The Starry Night
// Time Mechanic by Xinyue Qiu
// User Input Mechanic by Danlin Liu 

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
}

function draw() {
  // Get current time
  let now = millis() - timeOffset;

  // Calculate progress within the current phase
  let t = phaseTimes[currentPhase];
  phaseProgress = map(now, t.start, t.end, 0, 1);
  phaseProgress = constrain(phaseProgress, 0, 1);

  // Check and trigger timeline events
  while (eventIndex < timeline.length && now >= timeline[eventIndex].time) {
    handleEvent(timeline[eventIndex].event);
    eventIndex++;
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
    
  } else {
    drawSun(currentPhase);
    
  }

  drawBackWave()

  updateWhale();   

  drawOcean(currentPhase);

  drawBoat(currentPhase);

  updateFishSchool(); 

  drawFrontWave();

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

// Sky gradient per stage
function drawSky(stage) {
  let topColor, bottomColor;

  if (stage === "reality") {
    topColor = color(220, 225, 235);
    bottomColor = color(245, 215, 225);
  } else if (stage === "dream") {
    topColor = color(135, 110, 185);
    bottomColor = color(230, 180, 215);
  } else if (stage === "galaxy") {
    topColor = color(15, 15, 45);
    bottomColor = color(80, 50, 130);
  } else {
    topColor = color(250, 220, 230);
    bottomColor = color(255, 235, 195);
  }

  for (let y = 0; y < height; y++) {
   let inter = map(y, 0, height, 0, 1);
   let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawOcean(stage) {
    let topColor, bottomColor, waveAmplitude, waveSpeed, waveFreq;

   if (stage === "reality") {
    topColor = color(110, 140, 185);
    bottomColor = color(50, 75, 130);
    waveAmplitude = 15;
    waveSpeed = 0.03;
    waveFreq = 0.015;
  } else if (stage === "dream") {
    topColor = color(155, 120, 190);
    bottomColor = color(90, 70, 140);
    waveAmplitude = 25;
    waveSpeed = 0.04;
    waveFreq = 0.02;
  } else if (stage === "galaxy") {
    topColor = color(35, 40, 100);
    bottomColor = color(10, 10, 40);
    waveAmplitude = 40;
    waveSpeed = 0.06;
    waveFreq = 0.025;
  } else {
    topColor = color(175, 140, 180);
    bottomColor = color(100, 105, 160);
    waveAmplitude = 18;
    waveSpeed = 0.03;
    waveFreq = 0.015;
  }

// ===== SOUND MECHANIC — Anusha Jaiswal =====
  waveAmplitude = waveAmplitude * (1 + audioVolume * 8);
  // ===== END SOUND MECHANIC =====

  // Calculate wave y positions for each x
  let waveVertices = [];
  for (let x = 0; x <= width; x += 8) {
    let wy = height / 2 + sin(frameCount * waveSpeed + x * waveFreq) * waveAmplitude;
    waveVertices.push({ x: x, y: wy });
  }

  // Draw wave-shaped polygon: top edge = wave, bottom = canvas bottom
  noStroke();
  beginShape();
  for (let i = 0; i < waveVertices.length; i++) {
    let v = waveVertices[i];
    let depthInter = map(v.y, height / 2, height, 0, 1);
    fill(lerpColor(topColor, bottomColor, depthInter));
    vertex(v.x, v.y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Highlight line on top of the wave
  stroke(255, 255, 255, 50);
  strokeWeight(1.5);
  noFill();
  beginShape();
  for (let v of waveVertices) {
    vertex(v.x, v.y);
  }
  endShape();
}


// Sun with variable glow per stage
function drawSun(stage) {
  noStroke();
  
  // Sun moves from below horizon up into sky during reality
  let sunYPos;
  if (stage === "reality") {
    // Sun rises from y=height/2 to final position over 15s
    let t = constrain(map(millis() - timeOffset, 0, 8000, 0, 1), 0, 1);
    sunYPos = height / 2 + lerp(50, -60, easeOutCubic(t));
  } else {
    // Awakening: sun rises back up
    let t = constrain(map(millis() - timeOffset, 55000, 62000, 0, 1), 0, 1);
    sunYPos = lerp(height * 0.5, height * 0.22, easeOutCubic(t));
  }
  
  let glowSizes = [140, 100, 55];
  fill(255, 220, 180, 20);
  circle(width * 0.78, sunYPos, glowSizes[0]);
  fill(255, 220, 180, 50);
  circle(width * 0.78, sunYPos, glowSizes[1]);
  fill(255, 220, 180);
  circle(width * 0.78, sunYPos, glowSizes[2]);
}

// Helper function for smooth easing (like real motion)
function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}


// Moon with glow per stage
function drawMoon(stage) {
  noStroke();
  
  // Moon rises when dream starts
  let moonYPos;
  if (stage === "dream") {
    let t = constrain(map(millis() - timeOffset, 15000, 21000, 0, 1), 0, 1);
    moonYPos = lerp(height * 0.5, height * 0.22, easeOutCubic(t));
  } else if (stage === "galaxy") {
    moonYPos = height * 0.22; // stays in place
  } else {
    moonYPos = -60; // hidden in other phases
  }
  
  if (moonYPos < -30) return; // don't draw if off screen
  
  let glowSizes = [180, 130, 90];
  fill(255, 240, 220, 15);
  circle(width * 0.78, moonYPos, glowSizes[0]);
  fill(255, 240, 220, 30);
  circle(width * 0.78, moonYPos, glowSizes[1]);
  fill(255, 240, 220, 60);
  circle(width * 0.78, moonYPos, glowSizes[2]);
  fill(255, 245, 225);
  circle(width * 0.78, moonYPos, 55);
}

// Stars: count changes per phase, flickers with sin()
function drawStars(stage) {
  let targetCount;
  if (stage === "reality") targetCount = 0;      // no stars in reality
  else if (stage === "dream") targetCount = 30;
  else if (stage === "galaxy") targetCount = 80;
  else targetCount = 40;

  // Only draw up to targetCount (stars fade in as count grows)
  for (let i = 0; i < targetCount; i++) {
    // Make sure we have enough stars initialized
    if (i >= stars.length) {
      stars.push({
        x: random(width),
        y: random(height / 2),
        size: random(1, 3),
        offset: random(TWO_PI)
      });
    }
    let s = stars[i];
    
    // Stars drift slightly in dream/galaxy phases
    let driftY = 0;
    if (stage === "dream" || stage === "galaxy") {
      driftY = sin(frameCount * 0.01 + s.offset) * 2;
    }
    
    let brightness = map(sin(frameCount * 0.05 + s.offset), -1, 1, 150, 255);
    fill(brightness, brightness, brightness);
    noStroke();
    circle(s.x, s.y + driftY, s.size);
  }
}


// ===== EVENT HANDLER =====
function handleEvent(eventName) {
  if (eventName === "startReality") {
    currentPhase = "reality";
    targetFloatAmount = 5;
  }
  if (eventName === "sunSetMoonRise") {
    // Sun fades out, moon fades in
  }
  if (eventName === "startDream") {
    currentPhase = "dream";
  }
  if (eventName === "boatRise") {
    targetFloatAmount = 12;
  }
  if (eventName === "oceanDistort") {
    // Ocean waves become irregular
  }
  if (eventName === "starsMove") {
    // Stars begin moving
  }
  if (eventName === "startGalaxy") {
    currentPhase = "galaxy";
    targetFloatAmount = 20;
  }
  if (eventName === "starsSwirl") {
    // Stars form spiral flow
  }
  if (eventName === "boatOrbit") {
    // Boat enters orbital motion
  }
  if (eventName === "moonHalo") {
    // Moon emits glow rings
  }
  if (eventName === "startAwakening") {
    currentPhase = "awakening";
  }
  if (eventName === "boatDrop") {
    targetFloatAmount = 5;
  }
  if (eventName === "oceanReturn") {
    // Ocean reappears
  }
  if (eventName === "loopToReality") {
    currentPhase = "reality";
    eventIndex = 0;
    timeOffset = millis();
  }
}
// ============================================================
// USER INPUT MECHANICS
// Author: Danlin Liu
// ============================================================
function drawBoat(stage) {
  let floatSpeed = 0.03;
  let floatAmount = 5;
  if (stage === "dream") { floatSpeed = 0.04; floatAmount = 7; }
  else if (stage === "galaxy") { floatSpeed = 0.05; floatAmount = 9; }
  else if (stage === "awakening") { floatSpeed = 0.03; floatAmount = 5; }

  let floatY = sin(frameCount * floatSpeed) * floatAmount;


naturalRock = sin(frameCount * 0.025) * 0.09;
  let targetPersonX = map(mouseX, 0, width, -1, 1);
  personX = lerp(personX, targetPersonX, 0.08);
  let targetTilt = naturalRock + personX * 0.15 + (audioVolume * 0.4);  // Anusha - volume tilts boat
  boatTilt = lerp(boatTilt, targetTilt, 0.06);
  balanceScore = lerp(balanceScore,
    constrain((1 - abs(boatTilt) / 0.25) * 100, 0, 100), 0.08);

  let bx = width / 2;
  let by = height * 0.55;

  push();
  translate(bx, by + floatY);
  rotate(boatTilt);

  noStroke();
  fill(20, 15, 35, 60);
  ellipse(0, 28, 200, 14);

  fill(115, 70, 38);
  stroke(85, 52, 26);
  strokeWeight(1.5);
  beginShape();
  vertex(-95, 0);
  bezierVertex(-80, 22, 80, 22, 95, 0);
  vertex(78, 0);
  endShape(CLOSE);

  noStroke();
  fill(175, 120, 65);
  beginShape();
  vertex(-82, 2);
  bezierVertex(-68, 17, 68, 17, 82, 2);
  endShape(CLOSE);

  stroke(140, 90, 48);
  strokeWeight(1);
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    let px = i * 16;
    line(px, 2, px, 12 - abs(i) * 1.6);
  }
  noStroke();
  fill(145, 92, 46);
  rect(-42, 7, 24, 4, 1);
  rect(18, 7, 24, 4, 1);
  pop(); 
  drawCat(width / 2 + personX * 28, by + floatY);
  drawBalanceBar();

function drawBalanceBar() {
  let barX = width / 2 - 120;
  let barY = 20;
  let barW = 240;
  let barH = 16;
 
  noStroke();
  fill(0, 0, 0, 50);
  rect(barX - 12, barY - 6, barW + 24, barH + 32, 10);

  fill(255, 255, 255, 180);
  noStroke();
  textSize(11);
  textAlign(CENTER);
  text("Balance", width / 2, barY + 8);

  noStroke();
  fill(255, 255, 255, 20);
  rect(barX, barY + 14, barW, barH, barH / 2);

  let score = balanceScore;
  let barColor;
  if (score > 70) barColor = color(100, 220, 140);
  else if (score > 40) barColor = color(255, 195, 60);
  else barColor = color(255, 85, 85);

  fill(barColor);
  let fillW = barW * score / 100;
  rect(barX, barY + 14, fillW, barH, barH / 2);


  stroke(255, 255, 255, 100);
  strokeWeight(1);
  line(width / 2, barY + 12, width / 2, barY + 14 + barH + 2);

  noStroke();
  fill(255, 255, 255, 200);
  textSize(11);
  textAlign(CENTER);
  text(nf(score, 0, 0) + "%", width / 2, barY + 14 + barH + 22);
}

}

  function drawCat(px, py) {
  push();
  translate(px, py - 2);

  let lean = boatTilt * 2.8;
  rotate(lean);

  noFill();
  stroke(200, 160, 120);
  strokeWeight(3);
  let tailCurl = boatTilt * 3 + audioVolume * 8; // Anusha - tail curls with volume
  beginShape();
  vertex(6, -12);
  bezierVertex(22, -10, 30 + tailCurl * 8, -28, 18, -45 + tailCurl * 5);
  endShape();

  noStroke();
  fill(210, 170, 130);
  rect(-5, -14, 4.5, 14, 2);
  rect(0.5, -14, 4.5, 14, 2);

  fill(255, 200, 180);
  ellipse(-2.5, 1, 6, 4);
  ellipse(3, 1, 6, 4);

   fill(215, 175, 135);
  ellipse(0, -26, 20, 22);

 
  fill(245, 225, 205);
  ellipse(0, -24, 11, 13);

  let armSpread = abs(boatTilt) * 20;
  fill(210, 170, 130);
  noStroke();
  push();
  translate(-8, -32);
  rotate(-0.4 - boatTilt * 1.3);
  ellipse(-(8 + armSpread), 3, 7, 6);
 
  fill(255, 200, 180);
  ellipse(-(9 + armSpread), 3, 4, 3);
  pop();

  push();
  translate(8, -32);
  rotate(0.4 + boatTilt * 1.3);
  fill(210, 170, 130);
  ellipse(8 + armSpread, 3, 7, 6);
  fill(255, 200, 180);
  ellipse(9 + armSpread, 3, 4, 3);
  pop();

  fill(215, 175, 135);
  noStroke();
  ellipse(0, -46, 22, 20);

  fill(215, 175, 135);
  triangle(-8, -52, -12, -62, -2, -55);
  triangle(8, -52, 12, -62, 2, -55);

  fill(255, 180, 180);
  triangle(-7, -53, -10, -60, -3, -56);
  triangle(7, -53, 10, -60, 3, -56);


  fill(245, 230, 215);
  ellipse(0, -44, 14, 12);

 
  fill(60, 40, 20);
  ellipse(-4, -47, 5, 5.5);
  ellipse(4, -47, 5, 5.5);

  let pupilH = map(abs(boatTilt), 0, 0.3, 4.5, 1.5);
  fill(20, 10, 10);
  ellipse(-4, -47, 2.5, pupilH);
  ellipse(4, -47, 2.5, pupilH);

  fill(255);
  ellipse(-3, -48.2, 1.8, 1.8);
  ellipse(5, -48.2, 1.8, 1.8);

 
  fill(255, 150, 150);
  noStroke();
  triangle(-1.5, -43, 1.5, -43, 0, -41.5);

  stroke(180, 160, 140);
  strokeWeight(0.8);
 
  line(-3, -42, -14, -41);
  line(-3, -42.5, -13, -44);
  line(-3, -41.5, -13, -39);

  line(3, -42, 14, -41);
  line(3, -42.5, 13, -44);
  line(3, -41.5, 13, -39);

  noFill();
  stroke(180, 120, 100);
  strokeWeight(1);
  line(0, -41.5, 0, -40);
  if (abs(boatTilt) < 0.05) {
  
    arc(-1.5, -39.5, 3.5, 3, 0, PI);
    arc(1.5, -39.5, 3.5, 3, 0, PI);
  } else if (abs(boatTilt) < 0.15) {
  
    line(-2, -39, 2, -39);
  } else {
  
    arc(0, -38.5, 5, 4, 0, PI);
    fill(150, 200, 255, 140);
    noStroke();
    ellipse(12, -40, 3, 4.5);
  }

  fill(255, 130, 130, 80);
  noStroke();
  ellipse(-8, -43, 6, 4);
  ellipse(8, -43, 6, 4);

  pop();
}



// ===== SOUND MECHANIC — Anusha Jaiswal =====
function mousePressed() {
  if (song && !song.isPlaying()) {
    song.loop();
  }
}
// ===== END SOUND MECHANIC =====
