// https://mathworld.wolfram.com/SpherePointPicking.html

const urlParams = new URLSearchParams(window.location.search);
const x_ax = parseFloat(urlParams.get("x_ax") ?? 0)
const y_ax = parseFloat(urlParams.get("y_ax") ?? 100)
const z_ax = parseFloat(urlParams.get("z_ax") ?? 0)

const x_of = parseFloat(urlParams.get("x_of") ?? 0.01)
const y_of = parseFloat(urlParams.get("y_of") ?? 0)
const z_of = parseFloat(urlParams.get("z_of") ?? 0)

const r_base = parseInt(urlParams.get("r") ?? 255, 10)
const g_base = parseInt(urlParams.get("g") ?? 120, 10)
const b_base = parseInt(urlParams.get("b") ?? 0, 10)

const r_dev = parseInt(urlParams.get("r_dev") ?? 0, 10)
const g_dev = parseInt(urlParams.get("g_dev") ?? 0, 10)
const b_dev = parseInt(urlParams.get("b_dev") ?? 255, 10)

const order = parseInt(urlParams.get("order") ?? 0, 10)


let size = 500;

let cx = size/2;
let cy = size/2;
let cr = size/4;

let ZOOM_RATE = size/6;

let num_points = 5000;

let points = Array(num_points).fill([])


let angle_offset = 0;
let RATE = 0.05;

// let axis = [0, 100, 0]
let axis = [x_ax, y_ax, z_ax]
let norm = Math.sqrt(axis.reduce((a,b)=> a+b**2, 0))
axis = axis.map(axis=> axis/norm)

// let axis_offset = [.01, 0, 0]
let axis_offset = [x_of, y_of, z_of]


let FPS = 10
let TOTAL_TIME = 10

function calc_color(phi, theta){

	//give range 0 to 0.5
	let factor = min(phi/PI, 1 - phi/PI)

	// let factor2 = min(theta/(2*PI), 1 - theta/(2*PI))

	let r = randomGaussian(r_base, r_dev)
	let g = randomGaussian(g_base, g_dev)
	let b = randomGaussian(b_base, b_dev)

	// factor = factor + 0.75

	//gives range -1 to 1
	factor = factor*4 - 1
	factor = factor*50

	return color(r+factor, g+factor, b+factor)

	// switch (order) {
	// 	case 0:
	// 		return color(r*factor, g*factor2, b)
	// 	case 1:
	// 		return color(r*factor2, g*factor, b)
	// 	case 2:
	// 		return color(r, g*factor2, b*factor)
	// 	case 3:
	// 		return color(r, g*factor, b*factor2)
	// 	case 4:
	// 		return color(r*factor, g, b*factor2)
	// 	case 5:
	// 		return color(r*factor2, g, b*factor)
	// }
	// return color(255*random()*factor, 255*random()*factor2, 255*random())

	// // let from = color(255, 120, 0, 0.5 * 255);
	// // let to = color(0, 0, 255, 0.5 * 255);

	// let from = color(r_from, g_from, b_from, 0.5 * 255);
	// let to = color(r_to, g_to, b_to, 0.5 * 255);


	// let rng = random()*.4 - .2
	// let mod = phi/PI*.6+.2
	// return lerpColor(from, to, mod+rng)

	
	// return [150*phi*rng/PI, 255, 255]
}

function to_spherical(x, y, z){
	//phi, theta
	return [Math.atan2(sqrt(x**2 + y**2),z), Math.atan2(y, x)]
}

function to_cartesian(phi, theta){
	return [cr*sin(phi)*cos(theta), cr*sin(phi)*sin(theta), cr*cos(phi)]
}

function cross(a, b){
	let [a1, a2, a3] = a;
	let [b1, b2, b3] = b;

	return [a2*b3-b2*a3, b1*a3-a1*b3, a1*b2-b1*a2]
}

function dot(a, b){
	return a.map((item, idx) => a[idx] * b[idx]).reduce((a,b) => a+b, 0)
}

//both point, and axis are in cartesian
// https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
function rotate_cartesian(point, axis, rot_angle){
	// let cart_point = to_cartesian(...point);
	// let cart_axis = to_cartesian(...axis);
	let cart_point = point;
	let cart_axis = axis;

	// console.log(cart_point)
	// console.log(cart_axis)

	let r1 = cart_point.map(a => cos(rot_angle)*a)
	let r2 = cross(cart_axis, cart_point).map(a => sin(rot_angle)*a)
	let r3 = axis.map(a => dot(cart_point, cart_axis)*(1-cos(rot_angle))*a)

	// console.log(r1)
	// console.log(r2)
	// console.log(r3)
	// console.log("________")

	let new_point = r1.map((item, idx) => r1[idx] + r2[idx] + r3[idx])

	// console.log(new_point)

	return new_point;
	// return to_spherical(...new_point)
}

function in_circle(x, y){
	return pow(cx - x, 2) + pow(cy - y, 2) < pow(cr, 2);
}

// function rng_point(){
// 	let theta = 2*PI*random();
// 	let phi = PI*random();

// 	let [x,y,z] = to_cartesian(phi, theta)

// 	return {'x': x, 'y': y, 'z': z, 'dir': random([-1, 1]), 'length': 0, 'completed': false, 'color': calc_color(phi, theta)};
// }

function rng_point(){
	let x = randomGaussian(0, cr)
	let y = randomGaussian(0, cr)
	let z = randomGaussian(0, cr)

	let n = Math.sqrt([x, y, z].reduce((a,b)=> a+b**2, 0))
	// console.log(n)
	x = x/n*cr
	y = y/n*cr
	z = z/n*cr

	let [phi, theta] = to_spherical(x, y, z)

	return {'x': x, 'y': y, 'z': z, 'dir': random([-1, 1]), 'length': 0, 'completed': false, 'color': calc_color(phi, theta)};
}



function visualize(){


	points.map(item => {
		let old_point = [item.x, item.y, item.z]

		let new_point = rotate_cartesian(old_point, axis, angle_offset)

		let [x,y,z] = new_point;


		// console.log(x*x+y*y+z*z)
		// console.log(new_point)

		if(z > 0){
			let near = z/cr;
			// console.log(item['color'])
			// stroke(item['color'][0], item['color'][1], 255*near)
			// console.log(item['color']['levels'][3])
			// console.log(item['color']['alpha'])

			let curr_pixel = get(floor(cx+x), floor(cy+y))
			// console.log(curr_pixel)
			if(curr_pixel[0] == 0 && curr_pixel[1] == 0 && curr_pixel[2] == 0){


				item['color'].setAlpha(near*200)
				stroke(item['color'])
				strokeWeight(.25*near)
				point(cx + x, cy + y)

			}
		}
		// else{
		// 	stroke('green')
		// 	point(cx + x, cy + y)
		// }

	})
	
	angle_offset += RATE;
	axis = axis.map((item, idx) => axis_offset[idx] + item)
	let norm = Math.sqrt(axis.reduce((a,b)=> a+b**2, 0))
	axis = axis.map(axis=> axis/norm)

}

function setup() {
	// put setup code here
	createCanvas(size, size);
	background(0);
	frameRate(FPS);
	// colorMode(HSB, 255)

	;

	points = points.map(rng_point)

	// points.map((item) => point( .x, item.y));

	// console.log(points)

	createLoop({duration: TOTAL_TIME, framesPerSecond:FPS, gif: {render: false, download: true, open: false}, options:{quality: 5}})



}

function draw() {
	// put drawing code here
	// background(220);
	if(frameCount >= TOTAL_TIME*FPS+5){
		noLoop();
	}

	background(0);
	// console.log(points)
	let oldpoints = [...points].map(a => {
		let temp = {...a}
		temp['completed'] = true;
		return temp;
	})
	// console.log(oldpoints)
	// console.log(points)

	points = points.filter(a => !a['completed']).map((item) => {

		let x = item.x;
		let y = item.y;
		let z = item.z;

		let length = item.length;


		// stroke(.25*(x-cx) + .25*(y-cy), 255, 255*(1.2 - r/cr))

		// strokeWeight(2 - 2*r/cr)
		stroke(255)

		let dir = item.dir


		let [phi, theta] = to_spherical(x, y, z)

		//ensures continuity of noise
		let temptheta = theta;
		if(temptheta > PI){
			temptheta = 2*PI - temptheta
		}


		n = noise(x/ZOOM_RATE, y/ZOOM_RATE, z/ZOOM_RATE)

		phi += sin(2*PI*n)/(100)*dir;
		theta += cos(2*PI*n)/(100)*dir;

		let [newx, newy, newz] = to_cartesian(phi, theta);
		

		length += 1;


		let shouldstop = false;

		//taper
		if(random() > 50/length){
			shouldstop = true;
			if (random() > 0.5) {
				return rng_point();
			}
		}

		return {'x': newx, 'y': newy, 'z': newz, 'dir': dir, 'length': length, 'completed': shouldstop, 'color': item.color};

	})

	points = oldpoints.concat(points)

	// console.log(points.length)
	

	visualize();

}