// <---------------------------------------------------- CUESTICK --------------------------------------------------->
var cueStickAnimationFrame = 0;
var cueStickDrawn = false;
var cueStickLength = 20;

function drawCueStick() {
    push();
    const fixedBodyLength = 200;
    const fixedHandleLength = 100;
    const directionVector = Matter.Vector.normalise(Matter.Vector.create(cueBall.position.x - mouseX, cueBall.position.y - mouseY));
    const cueStickEndX = cueBall.position.x - cueStickLength * directionVector.x;
    const cueStickEndY = cueBall.position.y - cueStickLength * directionVector.y;
    const bodyEnd = Matter.Vector.create(cueStickEndX - fixedBodyLength * directionVector.x, cueStickEndY - fixedBodyLength * directionVector.y);
    const handleEnd = Matter.Vector.create(bodyEnd.x - fixedHandleLength * directionVector.x, bodyEnd.y - fixedHandleLength * directionVector.y);

    strokeWeight(5);
    stroke(255);
    line(cueStickEndX, cueStickEndY, bodyEnd.x, bodyEnd.y);
    stroke('#C87941');
    line(bodyEnd.x, bodyEnd.y, handleEnd.x, handleEnd.y);
    pop();
}

// <------------------------------------------------------------- ANIMATE CUESTICK ---------------------------------------------------->
function animateCueStick() {
    cueStickLength = 20; 
    cueStickAnimationFrame = 0;
    cueStickDrawn = true;
    const animationFrames = 60;

    function animate() {
        cueStickAnimationFrame++;
        if (cueStickAnimationFrame <= animationFrames) {
            cueStickLength += 0.5;
            setTimeout(animate, 30);
        } else {
            cueStickDrawn = false;
        }
    }
    animate();
}

