let size = 500;

let cx = size/2;
let cy = size/2;
let cr = size/4;

let ZOOM_RATE = size/3.5;

let num_points = 5;

let points = Array(num_points).fill([])


let RESOLUTION = 50;

let matrix = Array(RESOLUTION).fill(0).map(() => Array(2*RESOLUTION).fill(0));

let phi_offset = 0;
let theta_offset = 0;
let PHI_RATE = 0.001;
let THETA_RATE = 0.0;

let x_offset = 0;
let y_offset = 0;
let X_RATE = 0.001;
let Y_RATE = 0.0;

let angle_offset = 0;
let RATE = 0.001;

let axis = [0, 0, 1]


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

//both point, and axis are in spherical
// https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
function rotate_spherical(point, axis, rot_angle){
	let cart_point = to_cartesian(...point);
	// let cart_axis = to_cartesian(...axis);
	let cart_axis = axis;

	// console.log(cart_point)
	// console.log(cart_axis)

	let r1 = cart_point.map(a => cos(rot_angle)*a)
	let r2 = cross(cart_axis, cart_point).map(a => sin(rot_angle)*a)
	let r3 = axis.map(a => dot(cart_point, cart_axis)*(1-cos(rot_angle))*a)

	// console.log(r1)
	// console.log(r2)
	// console.log(r3)

	let new_point = r1.map((item, idx) => r1[idx] + r2[idx] + r3[idx])

	// console.log(new_point)

	return to_spherical(...new_point)
}

function in_circle(x, y){
	return pow(cx - x, 2) + pow(cy - y, 2) < pow(cr, 2);
}

function rng_point(){
	let theta = 2*PI*random();
	let phi = PI*random();

	return {'theta': theta, 'phi': phi, 'dir': random([-1, 1]), 'length': 0};
}




function visualize(){



	//i is phi, j is theta

	for(let i = 0; i < RESOLUTION; i += 1){
		for(let j = 0; j < 2*RESOLUTION; j += 1){

			let old_point = [i/RESOLUTION*PI, j/RESOLUTION*PI]
			// let cart = to_cartesian(i/RESOLUTION*PI, j/RESOLUTION*PI);
			let new_point = rotate_spherical(old_point, axis, angle_offset)
			// let t_matrix_offset = Math.floor(theta_offset/(PI)*RESOLUTION)
			// let t = (j+t_matrix_offset)%(2*RESOLUTION);

			// let p_matrix_offset = Math.floor(phi_offset/PI*RESOLUTION)
			// let p = (i+p_matrix_offset+RESOLUTION)%RESOLUTION;

			
			// console.log(old_point)
			// console.log(new_point)
			let p = Math.floor(new_point[0]/PI*RESOLUTION)
			let t = Math.floor(new_point[1]/PI*RESOLUTION)

			// let z = cr*cos(p/RESOLUTION*PI);
			let [x,y,z] = to_cartesian(...new_point)
			// console.log([x,y,z])
			// x = x

			if(matrix[p][t] === 1){
				// let x = cr*sin(i/RESOLUTION*PI)*cos(j/(RESOLUTION)*PI);
				// let y = cr*sin(i/RESOLUTION*PI)*sin(j/(RESOLUTION)*PI);
				// let z = cr*cos(i/RESOLUTION*PI);

				if(z > 0){
					stroke('red')
					point(cx+x,cy+y)
				}
				else{
					stroke('blue')
					point(cx+x,cy+y)
				}
			}
			
		}
	}

	phi_offset += PHI_RATE;
	theta_offset += THETA_RATE;
	angle_offset += RATE;

	// phi_offset %= PI;
	// theta_offset %= (2*PI)
}

function setup() {
	// put setup code here
	createCanvas(size, size);
	background(0);
	frameRate(20);
	colorMode(HSB, 255);

	points = points.map(rng_point)

	// points.map((item) => point( .x, item.y));


	points = points.map((item) => {

		let theta = item.theta;
		let phi = item.phi;
		let length = item.length;


		// stroke(.25*(x-cx) + .25*(y-cy), 255, 255*(1.2 - r/cr))

		// strokeWeight(2 - 2*r/cr)
		stroke(255)

		let dir = item.dir

		let temptheta = theta;
		if(temptheta > PI){
			temptheta = 2*PI-temptheta;
		}

		n = noise(phi, temptheta)
		// phi += sin(2*PI*n)/(200);
		// theta += cos(2*PI*n)/(200);

		// console.log(phi)


		if(phi > PI){
			phi = 2*PI-phi;
		}
		if(phi < 0){
			phi = -1*phi;
		}
		if(theta > 2*PI){
			theta = theta % (2*PI)
		}
		if(theta < 0){
			theta = theta + 2*PI
		}

		let access_phi = Math.floor(RESOLUTION*phi/PI)
		let access_theta = Math.floor(RESOLUTION*theta/(PI))

		matrix[access_phi][access_theta] = 1

		//taper start new point
		// if(random() > 200/length){
		// 	dir = 0;
		// 	return rng_point();
		// }

		length += 1;

		return {'phi': phi, 'theta': theta, 'dir': dir, 'length': length};

	})

}

function draw() {
	// put drawing code here
	// background(220);
	background(0);

	

	visualize();

}


//bug that creates smthn cool

// let size = 500;

// let cx = size/2;
// let cy = size/2;
// let cr = size/4;

// let ZOOM_RATE = size/3.5;

// let num_points = 100;

// let points = Array(num_points).fill([])


// let RESOLUTION = 500;

// let matrix = Array(RESOLUTION).fill(0).map(() => Array(2*RESOLUTION).fill(0));

// let phi_offset = 0;
// let theta_offset = 0;
// let PHI_RATE = 0.1;
// let THETA_RATE = 0;

// function in_circle(x, y){
// 	return pow(cx - x, 2) + pow(cy - y, 2) < pow(cr, 2);
// }

// function rng_point(){
// 	let theta = 2*PI*random();
// 	let phi = PI*random();

// 	return {'theta': theta, 'phi': phi, 'dir': random([-1, 1]), 'length': 0};
// }

// function visualize(){



// 	//i is phi, j is theta

// 	for(let i = 0; i < RESOLUTION; i += 1){
// 		for(let j = 0; j < RESOLUTION; j += 1){
// 			let p_matrix_offset = Math.floor(phi_offset/PI*RESOLUTION)
// 			let t_matrix_offset = Math.floor(theta_offset/(2*PI)*RESOLUTION)
// 			let p = (i+p_matrix_offset)%RESOLUTION;
// 			let t = (j+t_matrix_offset)%(2*RESOLUTION);

// 			let z = cr*cos(p/RESOLUTION*PI);

// 			if(matrix[p][t] === 1){
// 				let x = cr*sin(i/RESOLUTION*PI)*cos(j/RESOLUTION*2*PI);
// 				let y = cr*sin(i/RESOLUTION*PI)*sin(j/RESOLUTION*2*PI);
				

// 				if(z > 0){
// 					point(cx+x,cy+y)
// 				}
// 			}
			
// 		}
// 	}

// 	phi_offset += PHI_RATE;
// 	theta_offset += THETA_RATE;

// 	// phi_offset %= PI;
// 	// theta_offset %= (2*PI)
// }

// function setup() {
// 	// put setup code here
// 	createCanvas(size, size);
// 	background(0);
// 	frameRate(20);
// 	colorMode(HSB, 255);

// 	points = points.map(rng_point)

// 	// points.map((item) => point( .x, item.y));



// }

// function draw() {
// 	// put drawing code here
// 	// background(220);
// 	background(0);

// 	points = points.map((item) => {

// 		let theta = item.theta;
// 		let phi = item.phi;
// 		let length = item.length;


// 		// stroke(.25*(x-cx) + .25*(y-cy), 255, 255*(1.2 - r/cr))

// 		// strokeWeight(2 - 2*r/cr)
// 		stroke(255)

// 		let dir = item.dir

// 		let temptheta = theta;
// 		if(temptheta > PI){
// 			temptheta = 2*PI-temptheta;
// 		}

// 		n = noise(phi, temptheta)
// 		phi += sin(2*PI*n)/(200);
// 		theta += cos(2*PI*n)/(200);

// 		// console.log(phi)


// 		if(phi > PI){
// 			phi = 2*PI-phi;
// 		}
// 		if(phi < 0){
// 			phi = -1*phi;
// 		}
// 		if(theta > 2*PI){
// 			theta = theta % (2*PI)
// 		}
// 		if(theta < 0){
// 			theta = theta + 2*PI
// 		}

// 		let access_phi = Math.floor(RESOLUTION*phi/PI)
// 		let access_theta = Math.floor(RESOLUTION*theta/PI)

// 		matrix[access_phi][access_theta] = 1

// 		//taper start new point
// 		// if(random() > 200/length){
// 		// 	dir = 0;
// 		// 	return rng_point();
// 		// }

// 		length += 1;

// 		return {'phi': phi, 'theta': theta, 'dir': dir, 'length': length};

// 	})

// 	visualize();

// }