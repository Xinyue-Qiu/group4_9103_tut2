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

