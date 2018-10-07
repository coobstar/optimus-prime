/*
 * @name Animation
 * @description The circle moves.
 */
// Where is the circle
var x, y, rs, rLimit, newLimit, fillColors, limitReached, age, center, canvas, theta, initStyle;

function setup() {
  createCanvas(720, 400);
  // Starts in the middle
  x = width / 2;
  y = height / 2;
	rs = [0];
	rLimit = Math.max(width, height) * (4 / 3.141) * 3;
	newLimit = 31;
	fillColors = [color(255, 0, 0), color(255, 255, 0)];
	limitReached = 0;
	age = [0];
	center = [width / 4, height / 2];
	canvas = document.getElementById('defaultCanvas0');
	theta = 0;
	initStyle = 'width: 720px; height: 400px;';
}

function draw() {
  // Draw a circleq
  stroke(50);
	for (var i = 0; i< rs.length; i++) {
	  let aged = darken(fillColors[i % 2], age[i] * 0.03);
		//console.log(aged.setAlpha((255 * age[i] * 1) % 255));
		fill(aged);
		let offset  = age[i];//limitReached ? i + 1 : i;
  	ellipse((x + offset/*+ (width - offset * (width / 176))*/) - center[0], y - offset * (height / 101), rs[i], rs[i]);
		//if (rs[i - 1] >= newLimit) {
			rs[i] += 2;
			age[i] +=0.1;
			//age[i] += (Math.random() - 0.5) * 0.1;
		//}
	}

	if (newLimit < rs[rs.length - 1]) {
		rs.push(0);
		age.push(0);//(Math.random() - 0.5) * 2);
		//console.log(rs[0]);
		//console.log("age:", age);
				// Reset to the bottom
		if (rLimit < rs[0]) {
			limitReached = rs.length;
			console.log(rs.length, rs[0]);
			rs = rs.slice(1);
			age = age.slice(1);
			console.log(rs.length);
			[fillColors[1], fillColors[0]] = [fillColors[0], fillColors[1]]
		}
	}

	theta = (theta + 1) % 360;
	canvas.setAttribute('style', initStyle + ' filter: hue-rotate(' + theta + 'deg);');


}

function darken(c, v) {
	let c_n = color(0, 0, 0);
	c_n.setRed(red(c) * v);
	c_n.setGreen(green(c) * v);
	c_n.setBlue(blue(c) * v);
	return c_n;
}
