let size = 500;

let cx = size/2;
let cy = size/2;
let cr = size/4;

let ZOOM_RATE = size/3.5;

let num_points = Math.round(size/2);

let points = Array(num_points).fill([])



function in_circle(x, y){
	return pow(cx - x, 2) + pow(cy - y, 2) < pow(cr, 2);
}

function rng_point(){
	let r = cr*sqrt(random());
	let theta = 2*PI*random();

	let x = cx + r*cos(theta);
	let y = cy + r*sin(theta);

	return {'x': x, 'y': y, 'dir': random([-1, 1]), 'length': 0};
}

function setup() {
	// put setup code here
	createCanvas(size, size);
	background(0);
	frameRate(100);
	colorMode(HSB, 255);

	points = points.map(rng_point)

	points.map((item) => point(item.x, item.y));


}

function draw() {
	// put drawing code here
	// background(220);

	points = points.map((item) => {
		// console.log(item)
		let x = item.x;
		let y = item.y;
		let length = item.length;

		let r = sqrt(pow(item.x-cx, 2) + pow(item.y-cy, 2))

		stroke(.25*(x-cx) + .25*(y-cy), 255, 255*(1.2 - r/cr))

		strokeWeight(2 - 2*r/cr)

		let dir = item.dir

		if(in_circle(x, y) && dir !== 0){
			n = noise(x/ZOOM_RATE,y/ZOOM_RATE, sqrt(pow(x/ZOOM_RATE, 2) + pow(y/ZOOM_RATE, 2)))
			x += .5*sin(2*PI*n)*dir;
			y += .5*cos(2*PI*n)*dir;
			length += 1;
			point(x,y);
		}

		//taper start new point
		if(random() > 200/length){
			dir = 0;
			return rng_point();
		}

		return {'x': x, 'y': y, 'dir': dir, 'length': length};

	})



}



// draw one at a time

// let size = 500;

// let cx = size/2;
// let cy = size/2;
// let cr = size/4;

// let ZOOM_RATE = size/3.5;

// function incircle(x, y){
// 	return pow(cx - x, 2) + pow(cy - y, 2) < pow(cr, 2);
// }

// function setup() {
//   // put setup code here
//   createCanvas(size, size);
//   background(0);
//   frameRate(100);
//   colorMode(HSB, 255);


// }

// function draw() {
//   // put drawing code here
//   // background(220);
  
  
//   let r = cr*sqrt(random());
//   let theta = 2*PI*random();

//   stroke(255*theta/PI/2, 255*r/cr, 255)

//   let x = cx + r*cos(theta);
//   let y = cy + r*sin(theta);

//   point(x, y);

//   let dir = random([-1, 1])

//   while(incircle(x, y) && random() > 0.0005){
//   	n = noise(x/ZOOM_RATE,y/ZOOM_RATE)
//   	x += .5*sin(2*PI*n)*dir;
//   	y += .5*cos(2*PI*n)*dir;
//   	point(x,y);
//   }

// }