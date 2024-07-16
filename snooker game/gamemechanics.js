// <-------------------------------------------------- SNOOKER GAME MECHANICS ---------------------------------------->
var energyBarHeight = 250;
var maxForceMagnitude = 500; 

// <-----------------------------------------------ENERGY BAR----------------------------------------->
function drawEnergyBar() {
    push();
    var forceMagnitude = Math.sqrt((cueBall.position.x - mouseX) ** 2 + (cueBall.position.y - mouseY) ** 2);
    var energyPercentage = forceMagnitude / maxForceMagnitude;
    fill(50);
    rect(width / 2 + 430, height / 2 - 120 , 20, energyBarHeight); 

    if (mouseIsPressed && mouseDragged) {
        fill("#FF4500");
        energyPercentage = constrain(energyPercentage, 0, 1);
        rect(width / 2 + 430, height / 2 - 120 + (1 - energyPercentage) * energyBarHeight, 20, energyBarHeight * energyPercentage);  
    }
    pop();
}

// <------------------------------------------HEADS UP DISPLAY ------------------------------------------->
function drawHUD()
{
    push()
    fill(225,0,205,50);
    rectMode(CENTER)
    rect(width/2, height/2-tableHeight/1.3, 600,50);

    // Display the score
    textSize(24);
    fill(255);
    text("Score: " + score, width/2-tableWidth/2.2, height/2 - 220);
    textSize(16)
    text("press 5 for menu", width/2-50, height/2 - 220)
    pop()
}

// <-----------------------------------------------MODES------------------------------------>
function modeOne()
{
    resetPoolBalls();
    resetColorballs();
}

function modeTwo() {
    randomiseColoredBalls();
    randomisePoolballs();
}  

function modeThree() {
    resetColorballs()
    randomisePoolballs();
}


function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

// <-------------------------------------- DRAW SHOT INDICATOR -------------------------------->
function drawShotIndicator() {
    push();
    strokeWeight(5);
    const directionVector = createVector(cueBall.position.x-mouseX,cueBall.position.y-mouseY);
    const secondLineEndX = cueBall.position.x + directionVector.x;
    const secondLineEndY = cueBall.position.y + directionVector.y;
    strokeWeight(2);
    stroke(255);
    line(cueBall.position.x, cueBall.position.y, secondLineEndX, secondLineEndY);
    pop();
}

// <---------------------------------------- COLLISION DETECTION -------------------------------->
function collisionDetection() {
    for (var i = 0; i < poolBalls.length; i++) {
        var collisionWithPoolBall = Matter.Query.collides(cueBall, [poolBalls[i].body]);
        if (collisionWithPoolBall.length > 0) {
            console.log("Collided with pool ball at index " + i);
           
        }
    }

    for (var i = 0; i < colorballs.length; i++) {
        var collisionWithColorBall = Matter.Query.collides(cueBall, [colorballs[i].body]);
        if (collisionWithColorBall.length > 0) {
            console.log("Collided with color ball at index " + i);
            
        }
    }

    for ( var i =0; i < cushionWalls.length; i++) {
        var collisionWithColorBall = Matter.Query.collides(cueBall, [cushionWalls[i]]);
        if (collisionWithColorBall.length > 0) {
            console.log("Collided with cushion wall at index " + i);
            
        }
    }
}
// <------------------------------------------ GAMEOVER --------------------------------------->
function gameOver()
{
    push();
    textSize(36)
    fill("red")
    stroke("yellow")
    text("Game Over", width/2-100, height/2);   
    gameMusic.stop();
    pop()

}

function stopMusic(sound)
{
    sound.stop()
}