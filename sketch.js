let stars = [];
// ===== USER INPUT  =====
let personX = 0;      
let boatTilt = 0;         
let naturalRock = 0;     
let balanceScore = 100;   



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

function setup() {
  createCanvas(960, 540);

  // Initialize stars with positions and flicker offset
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3),
      offset: random(TWO_PI)
    });
  }
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

  drawSky(currentPhase);
  drawOcean(currentPhase);

  if (currentPhase === "reality") {
    drawSun(currentPhase);
    drawBoat(currentPhase);
  } else if (currentPhase === "dream") {
    drawMoon(currentPhase);
    drawStars(currentPhase);
    drawBoat(currentPhase);
  } else if (currentPhase === "galaxy") {
    drawStars(currentPhase);
    drawBoat(currentPhase);
  } else {
    drawSun(currentPhase);
    drawBoat(currentPhase);
  }
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

  for (let y = 0; y < height / 2; y++) {
    let inter = map(y, 0, height / 2, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Ocean gradient + wave animation
function drawOcean(stage) {
  let topColor, bottomColor, waveAmplitude, waveSpeed;

  if (stage === "reality") {
    topColor = color(110, 140, 185);
    bottomColor = color(50, 75, 130);
    waveAmplitude = 5;
    waveSpeed = 0.03;
  } else if (stage === "dream") {
    topColor = color(155, 120, 190);
    bottomColor = color(90, 70, 140);
    waveAmplitude = 8;
    waveSpeed = 0.04;
  } else if (stage === "galaxy") {
    topColor = color(35, 40, 100);
    bottomColor = color(10, 10, 40);
    waveAmplitude = 12;
    waveSpeed = 0.05;
  } else {
    topColor = color(175, 140, 180);
    bottomColor = color(100, 105, 160);
    waveAmplitude = 6;
    waveSpeed = 0.03;
  }

  noStroke();
  // Gradient ocean
  for (let y = height / 2; y < height; y++) {
    let inter = map(y, height / 2, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Animated waves overlay
  stroke(255, 255, 255, 60);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x <= width; x += 8) {
    let waveY = height / 2 + sin(frameCount * waveSpeed + x * 0.015) * waveAmplitude;
    vertex(x, waveY);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

// Sun with variable glow per stage
function drawSun(stage) {
  noStroke();
  let glowSizes = {reality: [140,100,55], awakening:[120,80,55]};
  let sizes = glowSizes[stage] || [140,100,55];

  fill(255, 220, 180, 20);
  circle(width * 0.78, height * 0.22, sizes[0]);
  fill(255, 220, 180, 50);
  circle(width * 0.78, height * 0.22, sizes[1]);
  fill(255, 220, 180);
  circle(width * 0.78, height * 0.22, sizes[2]);
}

// Moon with glow per stage
function drawMoon(stage) {
  noStroke();
  let glowSizes = {dream:[180,130,90], galaxy:[200,160,100]};
  let sizes = glowSizes[stage] || [180,130,90];

  fill(255, 240, 220, 15);
  circle(width*0.78, height*0.22, sizes[0]);
  fill(255, 240, 220, 30);
  circle(width*0.78, height*0.22, sizes[1]);
  fill(255, 240, 220, 60);
  circle(width*0.78, height*0.22, sizes[2]);
  fill(255, 245, 225);
  circle(width*0.78, height*0.22, 55);
}

// Stars with flicker per stage
function drawStars(stage) {
  let starCount = 20;
  if(stage==="dream") starCount=30;
  else if(stage==="galaxy") starCount=80;
  else if(stage==="awakening") starCount=40;

  for (let i = 0; i < starCount; i++) {
    let s = stars[i];
    let brightness = map(sin(frameCount*0.05 + s.offset), -1, 1, 180, 255);
    fill(brightness, brightness, brightness);
    noStroke();
    circle(s.x, s.y, s.size);
  }
}


// ===== EVENT HANDLER =====
function handleEvent(eventName) {
  if (eventName === "startReality") {
    currentPhase = "reality";
  }
  if (eventName === "sunSetMoonRise") {
    // Sun fades out, moon fades in
  }
  if (eventName === "startDream") {
    currentPhase = "dream";
  }
  if (eventName === "boatRise") {
    // Boat float amplitude increases
  }
  if (eventName === "oceanDistort") {
    // Ocean waves become irregular
  }
  if (eventName === "starsMove") {
    // Stars begin moving
  }
  if (eventName === "startGalaxy") {
    currentPhase = "galaxy";
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
    // Boat begins falling
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
}
naturalRock = sin(frameCount * 0.025) * 0.07;
  let targetPersonX = map(mouseX, 0, width, -1, 1);
  personX = lerp(personX, targetPersonX, 0.08);
  let targetTilt = naturalRock + personX * 0.15;
  boatTilt = lerp(boatTilt, targetTilt, 0.06);
  balanceScore = lerp(balanceScore,
    constrain((1 - abs(boatTilt) / 0.25) * 100, 0, 100), 0.08);

  let bx = width / 2;
  let by = height * 0.55;

  push();
  translate(bx, by + floatY);
  rotate(boatTilt);

  // 影子
  noStroke();
  fill(20, 15, 35, 60);
  ellipse(0, 28, 200, 14);

  // 木船船体
  fill(115, 70, 38);
  stroke(85, 52, 26);
  strokeWeight(1.5);
  beginShape();
  vertex(-95, 0);
  bezierVertex(-80, 22, 80, 22, 95, 0);
  vertex(78, 0);
  endShape(CLOSE);

  // 船内木板
  noStroke();
  fill(175, 120, 65);
  beginShape();
  vertex(-82, 2);
  bezierVertex(-68, 17, 68, 17, 82, 2);
  endShape(CLOSE);

  // 木板纹理线
  stroke(140, 90, 48);
  strokeWeight(1);
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    let px = i * 16;
    line(px, 2, px, 12 - abs(i) * 1.6);
  }

  // 横坐板
  noStroke();
  fill(145, 92, 46);
  rect(-42, 7, 24, 4, 1);
  rect(18, 7, 24, 4, 1);

  // 船沿高光
  stroke(155, 100, 52);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(-82, 2);
  bezierVertex(-68, 17, 68, 17, 82, 2);
  endShape();

  pop(); // 船旋转组结束

  // ── 画人（关键！这两行不能丢）──
  drawPerson(width / 2 + personX * 28, by + floatY);

  // ── 平衡进度条 ──
  drawBalanceBar();
}
function drawPerson(px, py) {
  push();
  translate(px, py - 2);
  let lean = boatTilt * 2.8;
  rotate(lean);

  // 腿
  noStroke();
  fill(60, 45, 65);
  rect(-4.5, -14, 4, 13, 2);
  rect(0.5, -14, 4, 13, 2);

  // 鞋子
  fill(80, 55, 60);
  rect(-5.5, -2, 5.5, 4, 1.5);
  rect(0.5, -2, 5.5, 4, 1.5);

  // 身体（粉色上衣）
  fill(255, 150, 160);
  rect(-6, -38, 12, 18, 4);

  // 腰带
  fill(90, 60, 55);
  rect(-6, -22, 12, 3, 1);

  // 手臂
  stroke(255, 150, 160);
  strokeWeight(3);
  noFill();
  let armSpread = abs(boatTilt) * 18;
  push();
  translate(-6, -34);
  rotate(-0.5 - boatTilt * 1.2);
  line(0, 0, -(10 + armSpread), 4);
  noStroke();
  fill(255, 210, 180);
  ellipse(-(10 + armSpread), 4, 5, 5);
  pop();
  push();
  translate(6, -34);
  rotate(0.5 + boatTilt * 1.2);
  line(0, 0, 10 + armSpread, 4);
  noStroke();
  fill(255, 210, 180);
  ellipse(10 + armSpread, 4, 5, 5);
  pop();

  // 头
  noStroke();
  fill(255, 215, 180);
  ellipse(0, -46, 18, 18);

  // 刘海
  fill(50, 25, 15);
  arc(0, -50, 18, 13, PI, TWO_PI);
  ellipse(-7, -44, 6, 10);
  ellipse(7, -44, 6, 10);

  // 眼睛
  fill(40, 25, 18);
  ellipse(-3.5, -46, 4, 4.5);
  ellipse(3.5, -46, 4, 4.5);
  fill(255);
  ellipse(-2.3, -47.2, 1.8, 1.8);
  ellipse(4.7, -47.2, 1.8, 1.8);

  // 腮红
  fill(255, 130, 130, 90);
  noStroke();
  ellipse(-7, -42, 6, 4);
  ellipse(7, -42, 6, 4);

  // 嘴巴
  noFill();
  stroke(40, 25, 18);
  strokeWeight(1.2);
  if (abs(boatTilt) < 0.05) {
    arc(0, -41, 6, 5, 0, PI);
  } else if (abs(boatTilt) < 0.15) {
    line(-2, -40, 2, -40);
  } else {
    line(-2, -41, 2, -41);
    fill(150, 200, 255, 140);
    noStroke();
    ellipse(8, -38, 3, 4.5);
  }

  pop();
}

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
