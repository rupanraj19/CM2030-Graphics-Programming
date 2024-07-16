// <------------------------------------- SNOOKER WORLD --------------------------------->
function setupSnookerWorld()
{
    calculateTablesize();
    setupTable();
    setupPocket();
    setupPoolBalls();
    setupCueBall();
    setupColoredBalls();
}

function drawSnookerWorld()
{
    background(108,122,137);
    Engine.update(engine);
    drawTable();
    drawCueBall();
    drawPoolBalls();
    drawColoredBalls();
    drawHUD();
    drawEnergyBar();
    collisionDetection();

    if (cueBallSetupMode) drawFreeBall();
    if(drawRules) image(rules, tableWidth/2+50 , 20, 500,500)
    if(drawMenu) background(menu);

    if (mouseIsPressed) {
        drawCueStick();
        drawShotIndicator();
    }
    
    if(poolBalls.length == 0) drawBallOrder();
   
    if(poolBalls.length == 0 && colorballs.length == 0)
    {   
       gameOver();
    }
}


