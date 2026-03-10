// <-------------------------------------------------SNOOKER BALLS----------------------------------------------------------->
var poolBalls = [];
var colorballs = [];
var colorOrder = [];
var consecutiveBalls = [];
var cueBall;
var shotIndicator; 
var score = 0;
var appliedForce;
var cueBallPrevVelocity = { x: 0, y: 0 };
var cueBallRest = false;
var cueBallDrawn = false;
var nextColoredBallIndex = 0;

// <------------------------------------------ FREE BALL --------------------------------------->
function drawFreeBall()
{   
    push();
    fill(255);
    if(!cueBallDrawn){
        var conMouseX = constrain(mouseX, width / 2 - tableWidth/3, width/2-tableWidth/4);
        var conMouseY = constrain(mouseY, height / 2 - tableHeight/5, height/2 + tableHeight/5);
        ellipse(conMouseX,conMouseY,ballDiameter);
    }else{
        ellipse(mouseX,mouseY,ballDiameter);
    }
    pop();
}

//<--------------------------------------------------CUEBALL ------------------------------------------------------->
function setupCueBall(x,y)
{
    cueBall = Bodies.circle(x, y, ballDiameter/2, {restitution:.8, friction: 0.5, density: 0.01, sleepThreshold: 30});
    World.add(engine.world, [cueBall])
}

function drawCueBall()
{
    push()
    fill(255);
    if(!cueBallDrawn){
    drawVertices(cueBall.vertices);
    }
    if (checkDistance(cueBall)) {
        resetCueBall();
    }
    checkCueballAtRest();
    pop()
}

//<-------------------------------------------------REDBALLS/POOLBALLS ---------------------------------------------->
function makePattern(rows, x, y, r) {
    let columns = 1;
    const ballsPattern = [];

    for (let i = 0; i < rows; i++) {
        const ballsRow = Array(columns).fill().map((_, colIndex) => 
            createVector(x + (columns - 1) * r * 2, y + (colIndex - columns / 2) * r * 2 + r)
        );

        ballsPattern.push(...ballsRow);
        columns++;
    }

    return ballsPattern;
}

function setupPoolBalls() {
    const ballPatternRows = 5;
    const ballPatternX = width / 4 + tableWidth / 1.38;
    const ballPatternY = height / 2;
    const ballPatternRadius = ballDiameter / 2;
    const poolBallsPattern = makePattern(ballPatternRows, ballPatternX, ballPatternY, ballPatternRadius);
    poolBalls = poolBallsPattern.map(({ x, y }) => new PoolBall(x, y, { restitution: 0.8, friction: 0.5 },"#FF0000"));
}

function PoolBall(x, y, options,color) {
    this.originalX = x;
    this.originalY = y;
    this.color = color;
    this.reset = function() {
        Body.setVelocity(this.body, { x: 0, y: 0 });
        Body.setPosition(this.body, { x: this.originalX, y: this.originalY });
    }
    this.body = Bodies.circle(x, y, ballDiameter / 2, options);
    World.add(engine.world, this.body);
} 

function drawPoolBalls() 
{   
    push()
    for (var i = 0; i < poolBalls.length; i++) {
        fill(poolBalls[i].color)
        drawVertices(poolBalls[i].body.vertices);

    }

    for (var ball of poolBalls) {
        if (checkDistance(ball.body)) {
            consecutiveBalls.push(ball);
            removeFromWorld(ball);
            checkConsecutiveBalls();
        }
    }
    pop();
}

// <---------------------------------------------COLORBALLS---------------------------------------------------------------->
function coloredBalls(x,y,size,options,color){
    this.body = Bodies.circle(x,y,size,options);
    this.color = color;
    this.originalX = x;
    this.originalY = y;
    World.add(engine.world, this.body);
}

function setupColoredBalls(){
    var options = {restitution:.8, friction: 0.5};
     var greenball = new coloredBalls(width/2-tableWidth/4, height/2-50, ballDiameter/2, options,"#00FF00");
     var brownball = new coloredBalls(width/2-tableWidth/4, height/2, ballDiameter/2, options,"#8B4513");
     var yellowball = new coloredBalls(width/2-tableWidth/4, height/2+50, ballDiameter/2, options,"#FFFF00");
     var blueball = new coloredBalls(width/2, height/2, ballDiameter/2, options,"#0000FF");
     var pinkball = new coloredBalls(width/2+tableWidth/5, height/2, ballDiameter/2, options,"#FFC0CB");
     var blackball = new coloredBalls(width/2+tableWidth/2.5, height/2, ballDiameter/2,options, "#000000" );
    colorballs.push(greenball,brownball,yellowball,blueball,pinkball,blackball);

    colorOrder = colorballs.map(ball => ball.color);
}

function drawColoredBalls(){
    for (var ball of colorballs) {
        fill(ball.color);
        drawVertices(ball.body.vertices);
            
        if (checkDistance(ball.body)) {
            if(poolBalls.length === 0 && ball.color === colorOrder[nextColoredBallIndex])
            { 
                removeFromWorld(ball); 
                if(coloredBalls.length != 0) nextColoredBallIndex++;
                addColorBallValue(ball.color);  
                               
            }else {
                resetPocketedBall(ball);
                consecutiveBalls.push(ball);
                checkConsecutiveBalls();
            }  
        }
    }  
}

// <-------------------------------------------RESET BALLS------------------------------------------------------------->
function resetCueBall() {
    Body.setVelocity(cueBall, { x: 0, y: 0 });
    cueBallDrawn = true;
    drawFreeBall();
    if(mouseIsPressed) {
        cueBallDrawn = false;
    Body.setPosition(cueBall, { x: mouseX, y: mouseY }); 
    }  
}

function resetPoolBalls() {
    for (var ball of poolBalls) {
        ball.reset();
    }
}

function resetColorballs(ball) {
    for (var ball of colorballs) {
        Body.setVelocity(ball.body, { x: 0, y: 0 });
        Body.setPosition(ball.body, { x: ball.originalX, y: ball.originalY });
    } 
}

function resetPocketedBall(ball) {
    Body.setVelocity(ball.body, { x: 0, y: 0 });
    Body.setPosition(ball.body, { x: ball.originalX, y: ball.originalY });
}

// <------------------------------------------- CHECK DISTANCE -------------------------------------------------------->
function checkDistance(ball) {
    if(gameState){
    var pos = ball.position;
    for (var i = 0; i < holes.length; i++) {
        var hole = holes[i];
        var distance = Matter.Vector.magnitude({
            x: pos.x - hole.x,
            y: pos.y - hole.y
        });

        if (distance < 19) {
            return true;
        }
    }
    return false;
    }else if(ovalgameState) {
        var pos = ball.position;
    for (var i = 0; i < ovalHoles.length; i++) {
        var hole = ovalHoles[i];
        var distance = Matter.Vector.magnitude({
            x: pos.x - hole.x,
            y: pos.y - hole.y
        });

        if (distance < 19) {
            return true;
        }
    }
    return false;
    }
} 


// <-----------------------------------------REMOVE FROM WORLD -------------------------------------------------->
function removeFromWorld(ball) {
    World.remove(engine.world, ball.body);   
        // Remove from poolBalls array
        var index = poolBalls.indexOf(ball);
        if (index !== -1) {
            poolBalls.splice(index, 1);
            score++; 
        }
     
        // Remove from colorballs array
        var index2 = colorballs.indexOf(ball);
        if (index2 !== -1) {
            colorballs.splice(index2, 1);
        }
}

// <----------------------------------------------- RANDOM BALLS ----------------------------------------------->
function randomisePoolballs() {
    const minX = width / 2 - tableWidth / 2.5;
    const minY = height / 2 - tableHeight / 2.5;
    const maxX = width / 2 + tableWidth / 2.5;
    const maxY = height / 2 + tableHeight / 2.5;

    for (var ball of poolBalls) {
        const randomX = random(minX, maxX);
        const randomY = random(minY, maxY);
        Body.setPosition(ball.body, { x: randomX, y: randomY });
    }
}

function randomiseColoredBalls() {
    const minX = width / 2 - tableWidth / 2.5;
    const minY = height / 2 - tableHeight / 2.5;
    const maxX = width / 2 + tableWidth / 2.5;
    const maxY = height / 2 + tableHeight / 2.5;

    for (var ball of colorballs) {
        const randomX = random(minX, maxX);
        const randomY = random(minY, maxY);
        Body.setPosition(ball.body, { x: randomX, y: randomY });
    }
}

// <------------------------------------------- CUEBALL MECHANICS ---------------------------------------------->
function checkCueballAtRest() {
    const velocity = cueBall.velocity;
    const threshold = 0.1; 

    if (abs(velocity.x) < threshold && abs(velocity.y) < threshold) {
        stroke("red")
        textSize(24)
        text("Click to Play", width/2-45,height-50)
        cueBallRest = true;
    } else {
        cueBallRest = false;
    }
    cueBallPrevVelocity = { x: velocity.x, y: velocity.y };
}

function constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// <------------------------------------------- BALL ORDER ----------------------------------------------------->
function drawBallOrder(){
    push();
    fill(colorOrder[nextColoredBallIndex]);
    textSize(20);
    text("Next Ball: ", width / 2 + tableWidth/4, 75);
    ellipse(width / 2 + tableWidth/2.4, 68, ballDiameter, ballDiameter);
    pop();
}

function checkConsecutiveBalls() {
    for (let i = 0; i < consecutiveBalls.length-1; i++) {
        const currentBall = consecutiveBalls[i];
        const nextBall = consecutiveBalls[i + 1];
        if(poolBalls.length != 0){
            if (currentBall.color != "#FF0000" && nextBall.color != "#FF0000") {
                alert("two color balls in a row and minus point");
                console.log("Consecutive balls with colors:", currentBall.color, "and", nextBall.color);
                consecutiveBalls.splice(i, 2); 
                i--; 
                score -= 1 ;
            }else if(currentBall.color == "#FF0000" && nextBall.color == "#FF0000")
            {
                alert("two red balls in a row and minus point")
                consecutiveBalls.splice(i,2);
                i--;
                score -= 2;
            }
        }
    }
}

// <------------------------------------- COLOR BALLS SCORE-------------------------------------------------->
function addColorBallValue(color) {
    switch (color) {
        case "#00FF00": // Green ball
            score += 2;
            break;
        case "#8B4513": // Brown ball
            score += 3;
            break;
        case "#FFFF00": // Yellow ball
            score += 4;
            break;
        case "#0000FF": // Blue ball
            score += 5;
            break;
        case "#FFC0CB": // Pink ball
            score += 6;
            break;
        case "#000000": // Black ball
            score += 7;
            break;
    }
}

function mouseDragged(){}







