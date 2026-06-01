function setup() {
  createCanvas(960, 540);
}

function draw() {

  let stage = getCurrentStage();

  if (stage === "reality") {

    background(135, 206, 235);

  }

  else if (stage === "dream") {

    background(200, 150, 255);

  }

  else if (stage === "galaxy") {

    background(30, 10, 80);

  }

  else {

    background(255, 220, 180);

  }

}