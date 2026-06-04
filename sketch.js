function setup() {
  createCanvas(960, 540);
}

function draw() {
  let stage = getCurrentStage();

  if (stage === "reality") {
    background(135, 206, 235);
    drawOcean(stage);
    drawSun();
    drawBoat();
  }

  else if (stage === "dream") {
    background(200, 150, 255);
    drawOcean(stage);
    drawMoon();
    drawStars(20);
    drawBoat();
  }

  else if (stage === "galaxy") {
    background(30, 10, 80);
    drawOcean(stage);
    drawStars(80);
    drawBoat();
  }

  else {
    background(255, 220, 180);
    drawOcean(stage);
    drawSun();
    drawBoat();
  }
}

function drawOcean(stage) {
  if (stage === "reality") {
    fill(50, 120, 220);
  } else if (stage === "dream") {
    fill(170, 140, 230);
  } else if (stage === "galaxy") {
    fill(20, 40, 100);
  } else {
    fill(120, 190, 230);
  }

  noStroke();
  rect(0, height / 2, width, height / 2);
}

function drawSun() {
  fill(255, 220, 120);
  noStroke();
  circle(width * 0.78, height * 0.22, 80);
}

function drawMoon() {
  fill(255, 240, 200);
  noStroke();
  circle(width * 0.78, height * 0.22, 70);

  fill(200, 150, 255);
  circle(width * 0.80, height * 0.20, 70);
}

function drawStars(amount) {
  fill(255, 235, 160);
  noStroke();

  for (let i = 0; i < amount; i++) {
    let x = random(width);
    let y = random(height / 2);
    circle(x, y, 3);
  }
}

function drawBoat() {
  fill(80, 45, 30);
  noStroke();

  triangle(
    width / 2 - 60,
    height * 0.68,
    width / 2 + 60,
    height * 0.68,
    width / 2,
    height * 0.76
  );

  fill(255, 245, 220);

  triangle(
    width / 2,
    height * 0.50,
    width / 2,
    height * 0.68,
    width / 2 + 70,
    height * 0.68
  );
}