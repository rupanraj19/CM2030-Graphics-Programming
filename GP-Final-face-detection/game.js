// <---------------------------------------------- HEN GAME ---------------------------------------->

var characterX;
var eggRadius = 20;
var eggs = [];
var score = 0;
var lives = 3;
var faceImgForGame;

// <------------------------------------------------- DRAW GAME WORLD ------------------------------------>
function drawGameWorld() {
    background(bg);
    if(lives != 0){
        push();
        translate(width, 0);
        scale(-1, 1); // Flip horizontally
        image(capture, 0, 0, 160, 120);
    
        faceImgForGame.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
        faces = detector.detect(faceImgForGame.canvas);
    
        strokeWeight(2);
        stroke(255);
        noFill();
    
        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            if (face[4] > 4) {
                rect(face[0], face[1], face[2], face[3]);
    
                // Call the drawLandmarks function to draw facial landmarks
                characterX = map(face[0] + face[2] / 2, 0, 160, 0, width);
            }
        }
    
        drawCharacter(); // Draw character (hen) at the bottom of the canvas
        generateEggs();
        drawEggs();
        pop();
     
        checkCollisions(); // Check for collisions between character and eggs
        displayScore();// Display score
        drawLives();
    }
    else
    {
        gameOver();
    }
    
 
}

// <---------------------------------- CHARACTER  AND EGGS ------------------------------------------->
function drawCharacter() {
    image(hen,characterX-60, height - 100, 120, 120 )
}

function generateEggs() {
    if (frameCount % 60 === 0) { // Generate eggs every second
        var eggX = random(eggRadius, width - eggRadius); // Random X position within canvas width
        var eggY = -eggRadius; // Start eggs from top of canvas
        var eggSpeed = random(3, 5); // Random falling speed for eggs
        var egg = { x: eggX, y: eggY, radius: eggRadius, speed: eggSpeed };
        eggs.push(egg);
    }
}

function drawEggs() {
    for (var i = 0; i < eggs.length; i++) {
        var egg = eggs[i];
        image(eggImg, egg.x-30, egg.y-25, egg.radius * 3, egg.radius * 3) // Draw egg
        egg.y += egg.speed; // Update egg's position
    }
}

// <------------------------------------- COLLISION DETECTION ------------------------------------>
function checkCollisions() {
    for (var i = eggs.length - 1; i >= 0; i--) {
        var egg = eggs[i];
        if (dist(characterX, height - 30, egg.x, egg.y) < eggRadius + 25) { // Collision detection with character
            eggs.splice(i, 1); // Remove collided egg
            score++; 
            catchMusic.play();
        }
        if (egg.y > height + egg.radius) { // Remove eggs that go beyond the canvas
            eggs.splice(i, 1);
            lives--
        }
    }
}

// <--------------------------------------------- GAME DISPLAY ---------------------------------->
function displayScore() {
    push()
    fill("green");
    textSize(20);
    textAlign(CENTER);
    text("Use face to move \nthe character right or left", 150, 50)
    text("Score: " + score, width - 100, 200);
    pop()
}

function gameOver()
{
        push()
        textSize(32)
        fill("red")
        text("Game Over ", width/2- 50,height/2);
        pop()

}

function drawLives() {
    var x = width - 100;
    var y = 150;
    var spacing = 20;
    fill("red");
    noStroke();
    textSize(20);
    for (var i = 0; i < lives; i++) {
        text("Lives: ", x - 60 , y, 10)
        image(hen, x + i * spacing, y, 20, 20);
    }
}