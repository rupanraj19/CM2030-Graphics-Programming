// <----------------------------------- OVAL SNOOKER MODE -------------------------------->
var ovalWalls = [];
var ovalHoles;

function setupOvalTableMode() {
    calculateTablesize();
    setupOvalTable();
    setupOvalTablePocket();
    setupCueBall();
    setupPoolBalls();
    setupColoredBalls();
}

function drawOvalTableMode() {
    background(108, 122, 137);
    Engine.update(engine);

    drawOvalTable();
    drawCueBall();
    drawPoolBalls();
    drawColoredBalls();
    drawHUD();
    drawEnergyBar();
    collisionDetection();

    if (cueBallSetupMode) drawFreeBall();

    if (mouseIsPressed) {
        drawCueStick();
        drawShotIndicator();
    }

    if (drawRules) image(rules, tableWidth / 2 + 50, 20, 500, 500);
    if (drawMenu) background(menu);

    if (poolBalls.length == 0 && colorballs.length == 0) {
        gameOver();
    }
}

function createOvalWalls(centerX, centerY, radiusX, radiusY, wallThickness) {
    var segments = 35;

    for (var i = 0; i < segments; i++) {
        var angle = (i / segments) * Math.PI * 2;
        var x = centerX + radiusX * Math.cos(angle);
        var y = centerY + radiusY * Math.sin(angle);

        var wall = Bodies.rectangle(x, y, wallThickness, 50, {
            angle: angle,
            isStatic: true,
        });

        ovalWalls.push(wall);
    }
}

function setupOvalTable() {
    createOvalWalls(width / 2, height / 2, 350, 175, 5);
    World.add(engine.world, ovalWalls);
}

function drawOvalTable() {
    push();
    // <-------------------------- OVAL TABLE WALLS --------------------->
    fill("#3D0000");
    for (var i = 0; i < ovalWalls.length; i++) {
        var vertices = ovalWalls[i].vertices;
        beginShape();
        for (var j = 0; j < vertices.length; j++) {
            vertex(vertices[j].x, vertices[j].y);
        }
        endShape(CLOSE);
    }

    // <----------- OVAL TABLE BORDER AND CUSHION --------------------------->
    fill("#3D0000");
    ellipse(width / 2, height / 2, 740, 400);
    fill("#1E5128");
    ellipse(width / 2, height / 2, 680, 330);

    for (var i = 0; i < ovalHoles.length; i++) {
        stroke("#FFFF00");
        pocket(ovalHoles[i].x, ovalHoles[i].y, pocketSize);
    }
    // <--------------------- ARC&LINE -------------------------------->
    stroke(255);
    noFill();
    line(width / 2 - tableWidth / 4, height / 2 - tableHeight / 2.2, width / 2 - tableWidth / 4, height / 2 + tableHeight / 2.2);
    angleMode(DEGREES);
    arc(width / 2 - tableWidth / 4, height / 2, 120, 120, 90, 270);
    noStroke();
    pop();
}

// <------------------------- OVAL POCKETS ------------------------------->
function setupOvalTablePocket() {
    ovalHoles = [
        { x: width / 2, y: height / 2 + tableHeight / 1.8 },
        { x: width / 2 + tableWidth / 1.75, y: height / 2 },
        { x: width / 2 - tableWidth / 1.73 + 5, y: height / 2 },
        { x: width / 2, y: height / 2 - tableHeight / 1.8 },
    ];
}
