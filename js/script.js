var rotateElement = document.querySelector('.rotate-on-scroll');
var currentRotation = 0;
var animationSpeed = 1;

setInterval(function() {
  // add a small rotation angle to the current rotation angle
  currentRotation += animationSpeed;
  rotateElement.style.transform = 'translate(-50%, -50%) rotate(' + currentRotation + 'deg)';
}, 50); // rotate the element every 50 milliseconds (adjust this value to change the speed)

document.getElementById('speed-up').addEventListener('click', function() {
  // increase the animation speed by 1 degree per frame
  animationSpeed += 1;
});

document.getElementById('slow-down').addEventListener('click', function() {
  // decrease the animation speed by 1 degree per frame
  animationSpeed -= 1;
});
