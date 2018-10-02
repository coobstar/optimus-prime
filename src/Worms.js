/*
 * @name Animation
 * @description The circle moves.
 */
// Where is the circle
var xs, y, h, os, offset, as;

function setup() {
  createCanvas(720, 400);
  // Starts in the middle
  xs = new Array(10).fill(0);
	os = new Array(10);
	as = new Array(10).fill(0);
	offset = 0;
	for (i in xs) {
		xs[i] = (i * width / 10) + width / 20 + random(-1 * width / 20, width / 20);
		os[i] = new p5.SinOsc();
		os[i].start();
	}
  y = height;
	h = random(255);
	colorMode(HSB, 255);
}

function draw() {
  //background(h, 255, 255);

  // Draw a circle
  stroke(0,0,0,0);
	for (i = 0; i < 10; i++) {
		fill(Math.abs(i* (255 / 10) + h) % 255,255, 255);
		ellipse(xs[i], y, as[i] * 24, as[i] * 24);

		var freqValue = midiToFreq(map(xs[i] - offset, 0, width, 40, 80));
    os[i].freq(freqValue);
		os[i].amp(as[i]);

		newX = (2 * xs[i] + random(-2, 2)) / 2;
		//line(xs[i], y, newX, y - 1);
		// Jiggling randomly on the horizontal axis
		xs[i] = newX;
		as[i] = (2 * as[i] + random(-0.01, 0.01)) / 2;
	}
		// Moving up at a constant speed
		y = y - 1;
  // Reset to the bottom
  if (y < 0) {
    y = height;
		h = random(255);
		offset = 0;//random(-10, 10);
  }
}
