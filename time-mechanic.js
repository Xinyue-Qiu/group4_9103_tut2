function getCurrentStage() {

  let time = (millis() / 1000) % 80;

  if (time < 20) {
    return "reality";
  }
  else if (time < 40) {
    return "dream";
  }
  else if (time < 60) {
    return "galaxy";
  }
  else {
    return "awakening";
  }

}

function drawOcean(stage) {

  if (stage === "reality") {
    fill(50, 120, 220);
  }

  else if (stage === "dream") {
    fill(170, 140, 230);
  }

  else if (stage === "galaxy") {
    fill(20, 40, 100);
  }

  else {
    fill(120, 190, 230);
  }

  noStroke();

  rect(
    0,
    height / 2,
    width,
    height / 2
  );

}