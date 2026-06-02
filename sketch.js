function setup() {
  createCanvas(960, 540);
}

function draw() {

  let stage = getCurrentStage();

  if (stage === "reality") {

    background(135, 206, 235);

    drawOcean(stage);

  }

  else if (stage === "dream") {

    background(200, 150, 255);

    drawOcean(stage);

  }

  else if (stage === "galaxy") {

    background(30, 10, 80);

    drawOcean(stage);

  }

  else {

    background(255, 220, 180);

    drawOcean(stage);

  }

}