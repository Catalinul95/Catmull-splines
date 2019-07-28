// CATMULL ROM SPLINES WITH OBJECT FOLLOWING THE PATH
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

const points = new Map();
// modify these control points to create some nice curves
// they are called this way because they control the curves
points.set(0, {x: 40, y: 90});
points.set(1, {x: 80, y: 180});
points.set(2, {x: 200, y: 90});
points.set(3, {x:280, y: 90});
points.set(4, {x:360, y: 90});
points.set(5, {x:480, y: 90});
points.set(6, {x:550, y: 200});

const path = [];
const car = {x: 0, y: 0, w:15, h:15};

// get the spline point
function getSpline(t) {
  let p0, p1, p2, p3;
  
  // the normalized min 4 points of a spline
  p1 = parseInt(t) + 1;
  p2 = p1 + 1;
  p3 = p2 + 1;
  p0 = p1 - 1;
  
  t = t - parseInt(t);
  
  let tt = t * t;
  let ttt = tt * t;
  
  // the ecuations for splines
  let q1 = -ttt + 2.0 * tt - t;
  let q2 = 3.0 * ttt - 5.0 * tt + 2.0;
  let q3 = -3.0 * ttt + 4.0 * tt + t;
  let q4 = ttt - tt;
  
  
  // the spline point
  let tx = 0.5 * ( points.get(p0).x * q1 + 
      points.get(p1).x * q2 + 
      points.get(p2).x * q3 + 
      points.get(p3).x * q4);
  
  let ty = 0.5 * (points.get(p0).y * q1 + 
      points.get(p1).y * q2 + 
      points.get(p2).y * q3 + 
      points.get(p3).y * q4);
  
  
  return {x: tx, y: ty};
 

}

// get the slope
function getSplineGradient(t) {
  let p0, p1, p2, p3;
  
  p1 = parseInt(t) + 1;
  p2 = p1 + 1;
  p3 = p2 + 1;
  p0 = p1 - 1;
  
  t = t - parseInt(t);
  
  let tt = t * t;
  let ttt = tt * t;
  
  // the derivates of the spline ecuations
  var q1 = -3.0 * tt + 4.0*t - 1;
  var q2 = 9.0*tt - 10.0*t;
  var q3 = -9.0*tt + 8.0*t + 1.0;
  var q4 = 3.0*tt - 2.0*t;
  
  // the spline point
  let tx = 0.5 * ( points.get(p0).x * q1 + 
      points.get(p1).x * q2 + 
      points.get(p2).x * q3 + 
      points.get(p3).x * q4);
  
  let ty = 0.5 * (points.get(p0).y * q1 + 
      points.get(p1).y * q2 + 
      points.get(p2).y * q3 + 
      points.get(p3).y * q4);
  
  
  return {x: tx, y: ty};
 

}


let fMaker = 0.0;
let i = 0;
let j = 0;
function loop() {
  ctx.clearRect(0, 0, 600, 600);
  window.requestAnimationFrame(loop);
  
  // draw the splines
  ctx.fillStyle = '#222';
  for (let t = 0.0; t < points.size - 3; t+= 0.005) {
    let point = getSpline(t);
    ctx.fillRect(point.x, point.y + 4, 1, 1);
    path.push(point);

  }
  
  // draw the control points
  for (let [key, value] of points) {
    ctx.fillRect(value.x, value.y, 10, 10);
  }
  
  // draw the object and animate it
  if (!i) {
    i = path.length;
  } else {
    
    if (j < i && fMaker < 4) {
      const g1 = getSplineGradient(fMaker);
      const angle = Math.atan2(g1.y, g1.x); 
      
      car.x = path[j].x;
      car.y = path[j].y ;
      
      
      ctx.save();
      ctx.translate(car.x + car.w / 2, car.y + car.h / 2);
      ctx.rotate(angle);
      ctx.fillStyle = 'red';
      ctx.fillRect(-car.w / 2, -car.h / 2, car.w, car.h);
      ctx.rotate(-angle);
      ctx.restore();
     
      
      fMaker += 0.005;
  
      
    } else {
      j = 0;
      fMaker = 0;
    }
    
  }
  j++;
  
}

loop();