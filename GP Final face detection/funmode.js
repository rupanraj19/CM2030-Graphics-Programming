// <----------------------------- FUNMODE --------------------------------------->

let faceapi;
let detections = [];
let skeleton = [];
let faceOptions;
let poseNet;
let pose;
let enemyPower;
let PlayerPower;
let playing = false;
let balls = []; 
let ballSpeed = 5;
let gameStarted = false; 
let back = true;
let rectWidth = 100;
let rectHeight = 400;
let rectX = 1200/1.2; 
let rectY = 1200/1.8 - rectHeight / 2;

function toggleVid() {
    if (playing) {
        cat.stop();
    } else {
        cat.loop();
        playButton.html('stop');
    }
    playing = !playing;
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelReady() {
    console.log('poseNet ready!');
    faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
    faceapi.detect(gotFaces); // Start detecting faces
}

// <----------------------------------- DRAW FUN WORLD --------------------------------->
function drawFunWorld() {
    if(gameStarted){
        background(gamebg)
        drawEnergyBar()
        image(warrior, rectX-450, rectY, 711, 351 )
        if (pose) {
        let rightWrist = pose.rightWrist;
        
        if (rightWrist) {
            let wristX = rightWrist.x;
            let wristY = rightWrist.y;
            if (wristX > rectX && wristX < rectX + rectWidth && wristY > rectY && wristY < rectY + rectHeight) {
                // Collision detected, reduce power
                console.log("Collision detected")
                enemyPower -= 10;
                if (enemyPower <= 0) {
                    gameStarted = false;
                }
            }
        }
    }

    if (frameCount % 120 === 0) { // Adjust the frame count as needed
        let randX = random(rectX, rectX + rectWidth);
        let randY = rectY + (rectHeight * 0.05); // 5% from the top of the rect
        let newBall = { x: randX, y: randY };
        balls.push(newBall);
    }

    // Draw and move balls
    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        fill(255);
        if(enemyPower > 0 ){
        ellipse(ball.x, ball.y, 20, 20);
        }
        ball.x -= ballSpeed;

        // Check for collision with body
        if (pose) {
            let playerKeypoints = pose.keypoints;
            for (let j = 0; j < playerKeypoints.length; j++) {
                let keypoint = playerKeypoints[j];
                if (dist(ball.x, ball.y, keypoint.position.x, keypoint.position.y) < 20) {
                    // Collision detected, reduce player's power
                    console.log("ball collided with player")
                    PlayerPower -= 10;
                    if (PlayerPower <= 0) {
                        gameStarted = false; 
                    }
                    balls.splice(i, 1); // Remove the ball
                    break; // Exit loop since collision detected
                }
            }
        }
        // Remove balls that are off-screen
        if (ball.x < 0) {
            balls.splice(i, 1);
        }
    }
    }else{
        background(gamebg);
        gameOver();

    }
    if(back)
    {
        background(0)
        gameStarted = false;
    }

    if(gameStarted==false){
        image(cat, 0, 100, width,800);
    }
    image(video, 0, 0, 160, 120);
    drawBoxes(detections);
    drawLandmarks(detections);
    if (pose) {
        if(gameStarted) {
            fill(255,0,0);
            ellipse(pose.leftEye.x, pose.leftEye.y, 20, 20); //lefteye
            ellipse(pose.rightEye.x,pose.rightEye.y, 20, 20); //righteye
            let triangleSize = 50; // Size of the triangle
            let halfSize = triangleSize / 2; // Half of the size for positioning
          
            triangle(
              pose.nose.x - halfSize, pose.nose.y + halfSize, // Bottom left point
              pose.nose.x + halfSize, pose.nose.y + halfSize, // Bottom right point
              pose.nose.x, pose.nose.y - halfSize // Top point (nose)
            );
            noFill()
        }
        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            stroke("pink");
            strokeWeight(5);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
            noStroke()
        }
    }

    // Draw hat on top of the detected face
    if (detections.length > 0) {
        let face = detections[0].alignedRect._box;
        let hatWidth = face._width * 1.2;
        let hatHeight = face._height * 1.2;
        let hatX = face._x + face._width / 20;
        let hatY = face._y - hatHeight / 1.2;
        image(hatImg, hatX - 30, hatY, hatWidth, hatHeight);
    }
}
// <---------------------------------- GOT FACES ------------------------>
function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return;
    }

    detections = result; // Now all the data in this detections
    console.log(gotFaces);
    faceapi.detect(gotFaces); // Call the function again here
}

// <---------------------------- DRAW BOX AND LANDMARKS ----------------------------->
function drawBoxes(detections) {
    if (detections.length > 0) {
        // If at least 1 face is detected
        for (f = 0; f < detections.length; f++) {
            let { _x, _y, _width, _height } = detections[f].alignedRect._box;
            stroke(44, 169, 225);
            strokeWeight(1);
            noFill();
            rect(_x, _y, _width, _height);
        }
    }
}

function drawLandmarks(detections) {
    if (detections.length > 0) {
        // If at least 1 face is detected
        for (f = 0; f < detections.length; f++) {
            let points = detections[f].landmarks.positions;
            for (let i = 0; i < points.length; i++) {
                stroke("green");
                strokeWeight(10);
                point(points[i]._x, points[i]._y);
                noStroke();
            }
        }
    }
}

// <---------------------------- DRAW ENERGY BAR ----------------------------->
function drawEnergyBar()
{
    push()
    let energyBarWidth = map(enemyPower, 0, 500, 0, rectWidth);
    let energyBarColor = color(0, 255, 0);
    if (enemyPower < 200) {
        energyBarColor = color(255, 255, 0); // Yellow if power is low
    }
    if (enemyPower < 100) {
        energyBarColor = color(255, 0, 0); // Red if power is critically low
    }
    fill(energyBarColor);
    rect(rectX, 100, energyBarWidth, 10);

    let playerEnergyBarWidth = map(PlayerPower, 0, 500, 0, rectWidth);
    let playerEnergyBarColor = color(0, 255, 0); // Green by default
    if (PlayerPower < 200) {
        playerEnergyBarColor = color(255, 255, 0); // Yellow if power is low
    }
    if (PlayerPower < 100) {
        playerEnergyBarColor = color(255, 0, 0); // Red if power is critically low
    }
    fill(playerEnergyBarColor);
    rect(10, 120, playerEnergyBarWidth*3, 10);
    pop()
}

// <------------------------- GAME STATE ------------------------>
function toggleGameState()
{  
    gameStarted = true;
    enemyPower = 500;
    PlayerPower = 100;
    back = false;
}

function goBack()
{
    back = true;
}