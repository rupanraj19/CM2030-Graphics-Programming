// <------------------------------------------------------ FUM MODE ------------------------------------------------------->
var boxes = [];
var greenBalls = [];
var checkGreen=[];
var blackBalls = [];
var score = 0;
var lives= 3;
var isRight = false;
var isLeft = false;
var cuemanposx, cuemanposy, cuemanVelocityX;
var cuemanBody;

// <----------------------------------------- CUEMAN AND HIS WORLD ----------------------------------------------------------->
function setupCuemanWorld()
{

    cuemanposx = width / 2;
    cuemanposy = height - 50;
    cuemanVelocityX = 5;
    floor = Bodies.rectangle(width / 2, height - 5, width, 10, { isStatic: true });
    cuemanBody = Bodies.rectangle(cuemanposx, cuemanposy, 50, 100, {  friction: 0.5, gravity: { scale: 0 }, isStatic: true });
    World.add(engine.world, [cuemanBody, floor]);

    generateGreenBall();    
    generateBlackBall();

    setTimeout(function() {
        setInterval(generateGreenBall, 2000); 
    }, 5000);
    
    setTimeout(function() {
            setInterval(generateBlackBall, 1000); 
    }, 5000);

}

function drawCuemanWorld() {
    background(108,122,137);
    Engine.update(engine);
    fill("red");
    drawVertices(cuemanBody.vertices);

    fill("green")
    drawVertices(floor.vertices);

    fill("yellow");
    generateObjects(width / 2, 0);
    for (var i = 0; i < boxes.length; i++) {
        drawVertices(boxes[i].vertices);
    
        if (isOffScreen(boxes[i]) || isCollision(floor, boxes[i])) {
            // remove objects that are off-screen or collide with the floor
            World.remove(engine.world, boxes[i]);
            boxes.splice(i, 1);
            i--;
        } else {
            if (isCollision(cuemanBody, boxes[i])) {
                console.log("Collision!");
            }
        }
    }

    display()
    health();

    CheckCollisions(greenBalls, "green");
    CheckCollisions(blackBalls, "black");
}

function moveCueman() {
    var cuemanWidth = 50;
    if (isLeft && cuemanBody.position.x - cuemanWidth / 2 > 0) {
        Body.translate(cuemanBody, { x: -10, y: 0 });
    } else if (isRight && cuemanBody.position.x + cuemanWidth / 2 < width) {
        Body.translate(cuemanBody, { x: 10, y: 0 });
    }
}

// <-------------------------------------------- GENERATE OBJECTS ----------------------------------------------------------------->
function generateObjects() {
    var x = random(width); 
    var y = 0; 
    var b = Bodies.rectangle(x, y, random(10, 30), random(10, 30), { restitution: 0.8, friction: 0.5 });
    boxes.push(b);
    World.add(engine.world, [b]);
}

function generateGreenBall() {
    var x = random(10,width-100);
    var y = 0;
    var greenBall = Bodies.circle(x, y, 15, { restitution: 0.8, friction: 0.5, label: "greenBall" });
    greenBalls.push(greenBall);
    World.add(engine.world, greenBall);
}

function generateBlackBall() {
    var x = random(10,width-100);
    var y = 0;
    var blackBall = Bodies.circle(x, y, 15, { restitution: 0.8, friction: 0.5, label: "blackBall" });
    blackBalls.push(blackBall);
    World.add(engine.world, blackBall);
}

// <------------------------------------------- CHECK COLLISIONS ---------------------------------------------------------------->
function CheckCollisions(balls, color) {
    for (var i = 0; i < balls.length; i++) {
        fill(color);
        drawVertices(balls[i].vertices);

        if (isOffScreen(balls[i]) || isCollision(floor, balls[i])) {
            if(color =="green") checkGreen.push(balls[i]);
            World.remove(engine.world, balls[i]);
            balls.splice(i, 1);
            i--;
        } else {
            // check collision with cueman
            if (isCollision(cuemanBody, balls[i])) {
                if (color == "green") {
                    console.log("Green ball collected! Increase score.");
                    score++;
                } else if (color == "black") {
                    console.log("Black ball collected! Decrease lives.");
                    lives--;
                    explosion.play()
                }

                World.remove(engine.world, balls[i]);
                balls.splice(i, 1);
                i--;
            }
        }
    }
}

function isOffScreen(body) {
    var pos = body.position;
    return pos.y > height || pos.x < 0 || pos.x > width;
}

function isCollision(bodyA, bodyB) {
    return Matter.Query.collides(bodyA, [bodyB]).length > 0;
}

function health()
{
    if(lives >0) {
        moveCueman();
    }
       
    if(lives <= 0)
    {   
      gameOver();
    }
    if(checkGreen.length >= 3)
    {
        lives --
        explosion.play();
        checkGreen = [];
    }
}

function display()
{
        textSize(24);
        fill(255);
        stroke("yellow");
        text("Score: " + score, 20, 75);
        fill(255,0,0);
        stroke(0);
        text("Lives: " + lives, width -100, 75);
        text("use A and D to move", width -225, 95)
}