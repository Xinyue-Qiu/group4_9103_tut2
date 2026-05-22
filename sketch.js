// Let's make a variable to hold the audio file
let song;

// Let's make a variable to hold the FFT object
let fft;

// Let's make a variable for the number of bins in the FFT object
// This is how many frequency bands we will have
// The number of bins must be a power of 2 between 16 and 1024 
// Try changing this value
let numBins = 128;

// We will also have a variable for the smoothing of the FFT
// This averages the values of the frequency bands over time so it doesn't jump around too much
// Smoothing can be a value between 0 and 1
// Try changing this value
let smoothing = 0.8;

// This time we will make a global variable for the button so we can access it in the windowResized function
let button;

// Load sound file before setup() function runs
function preload() {
  // Audio file from freesound https://freesound.org/people/multitonbits/sounds/383935/?
  song = loadSound("assets/383935__multitonbits__bs_electricity-bass-2.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a new instance of p5.FFT() object
  fft = new p5.FFT(smoothing, numBins);

  song.connect(fft);
  
  // Add a button for play/pause
  // We cannot play sound automatically in p5.js, so we need to add a button to start the sound
  button = createButton("Play/Pause");

  // Set the position of the button to the bottom centre
  button.position((width - button.width) / 2, height - button.height - 2);

  // We set the action of the button by choosing what action and then a function to run
  // In this case, we want to run the function play_pause when the button is pressed
  button.mousePressed(playPause);

  // Set the colour mode to HSB
  colorMode(HSB, 255);
}

function draw() {
  background(0);

  // Calculate the minimum dimension to determine the size of the circles
  let minDimension = min(width, height);
  // We will make an inner circle with a radius of 1/5 of the minimum dimension
  let circleRadius = minDimension / 5;
  // We will make the rectangles 2/5 of the minimum dimension so 2 rectangles and the circle will fit in the window
  let maxRectLength = (minDimension * 2) / 5;

  // Get overall amplitude between 20 Hz to 20 kHz
  let amplitude = fft.getEnergy(20, 20000);

  // Get the spectral centroid - this is the "centre of mass" of the frequency spectrum
  let centroidFreq = fft.getCentroid();

  // analyze() method returns an array of amplitude values across the frequency spectrum
  // Amplitude values range between 0 and 255, where at 0, the sound at the specific frequency band is silent
  // and at 255, the sound at the specific frequency band is at its loudest
  let spectrum = fft.analyze();

  // Set the centre for drawing
  translate(width / 2, height / 2);

  for (let i = 0; i < spectrum.length; i++) {
    // We want to spread the rectangles evenly around the circle
    // We will use the map function to map the index of the spectrum array to an angle
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);

    // We use the same calculation as in the simple FFT example to calculate the height of the rectangle
    let rectHeight = map(spectrum[i], 0, 255, 0, maxRectLength);

    // We use push() and pop() to isolate the rotation so each rectangle is rotated individually
    push();
    // Rotate amount is based on which rectangle we are drawing
    rotate(angle); 
    // Set the fill colour based on the frequency band as before
    fill(map(i, 0, spectrum.length, 0, 255), 255, 255);
    // Draw the rectangle at 0 on the x-axis, circleRadius on the y-axis
    rect(0, circleRadius, width / spectrum.length, rectHeight);
    // Pop the rotation so the next rectangle is drawn with its own rotation
    pop();
  }

  // We will draw an inner circle that changes size based on the amplitude
  // and changes colour based on the spectral centroid
  // We will map the amplitude to the size of the circle
  let innerCircleSize = map(amplitude, 0, 255, circleRadius / 5, circleRadius);

  // Map the spectral centroid to a colour
  let colorVal = map(centroidFreq, 0, 22050, 0, 255);
  fill(colorVal, 255, 255);

  // Draw the inner circle at the centre of the canvas with a size based on the amplitude
  // We multiply the size by 2 because the size of the ellipse is the diameter, not the radius
  ellipse(0, 0, innerCircleSize * 2);
}

function playPause() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    // We can use song.play() here if we want the song to play once
    // In this case, we want the song to loop, so we call song.loop()
    song.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reset the position of the button
  button.position((width - button.width) / 2, height - button.height - 2);
}