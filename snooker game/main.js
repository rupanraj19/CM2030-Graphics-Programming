// <------------------------------------------------- MAIN FILE ------------------------------------------------------------->
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var engine;
var gameState = false;
var ovalgameState = false;
var homePage = true;
var modePage = false;
var drawRules = false;
var drawMenu = false;
var funMode = false;
var cuemanWorld = false;
var cueBallSetupMode = true;

// <--------------------------------------------------- PRELOAD ----------------------------------------------------------->
function preload() {
    // <---IMAGE----->
    start = loadImage('assets/start.png');
    gameMode = loadImage('assets/choosemode.png');
    menu = loadImage('assets/menu.png');
    rules = loadImage('assets/rules.png');
    story = loadImage('assets/story.png');
    // <---SOUND------>
    gameMusic = loadSound('assets/game-music.mp3');
    strike = loadSound('assets/strike.wav');
    explosion = loadSound('assets/explosion.mp3');

}

// <-------------------------------------------------- SETUP ---------------------------------------------------------------->
function setup() {
    canvas = createCanvas(1200, 600);
    engine = Engine.create()
    chooseGameMode();
}

// <------------------------------------------------------ DRAW ------------------------------------------------------------>
function draw() {

    if (homePage) {
        background(start);
    }else if (modePage) {
        chooseGameMode();
    }else if(gameState){
        drawSnookerWorld();
    }else if(ovalgameState){
        drawOvalTableMode();
    }else if(funMode){
        if(cuemanWorld)
        {
            drawCuemanWorld();
        } 
    }
}

// <------------------------------------------------------- CHOOSE GAME MODE ---------------------------------------------->
function chooseGameMode()
{
    background(gameMode);
    if (mouseIsPressed && modePage) {
        if (mouseX < 400) {
            modePage = false;
            engine.world.gravity.y = 0;
            gameState = true;
            setupSnookerWorld(); 
        } else if (mouseX > 800) {
            modePage = false;
            funMode = true;
            setupCuemanWorld();
            background(story);
            gameMusic.play()

        }else if(mouseX > 400 && mouseX < 800)
        {
            modePage = false;
            engine.world.gravity.y = 0;
            ovalgameState = true;
            setupOvalTableMode();
        }
    }
}

// <------------------------------------------------------ HELPER FUNCTIONS ---------------------------------------------->
function keyPressed() {
    if (keyCode === ENTER && homePage == true) {
            homePage = false; 
            modePage = true;  
        }

    switch (key) {
        case '1':
            modeOne();
            break;
        case '2':
            modeTwo();
            break;
        case '3':
            modeThree();
            break;
        case '4':
            drawRules = !drawRules;
            break;
        case '5':
            drawMenu = !drawMenu;
            break;
    }  
    
    if (key === 'a' || key === 'A') {
        isLeft = true;
    } else if (key === 'd' || key === 'D') {
        isRight = true;
    }
}
    
function keyReleased() {
    if (key === 'a' || key === 'A') {
        isLeft = false;
    } else if (key === 'd' || key === 'D') {
        isRight = false;
    }
}

function mousePressed() {
    if(gameState || ovalgameState){
    var conMouseX = constrain(mouseX, width / 2 - tableWidth / 3, width / 2 - tableWidth / 4);
    var conMouseY = constrain(mouseY, height / 2 - tableHeight / 5, height / 2 + tableHeight / 5);
    if (cueBallSetupMode) {
        setupCueBall(conMouseX, conMouseY);
    }
    cueBallSetupMode = false;

    if (!cueStickDrawn) {
        cueStickDrawn = true;
        animateCueStick();
    }
    cueStickDrawn = false;
    } 

    if(funMode) cuemanWorld = true;
}

function mouseReleased() {
    if (gameState || ovalgameState) {
        var force = 2500;
        var forceX = (cueBall.position.x - mouseX) / force;
        var forceY = (cueBall.position.y - mouseY) / force;
        if (cueBallRest || (cueBallPrevVelocity.x === 0 && cueBallPrevVelocity.y === 0)) {
            strike.play();
            Body.applyForce(cueBall, { x: cueBall.position.x, y: cueBall.position.y }, { x: forceX, y: forceY });
        }
    }
}



/* <------------------------------------- GRAPHICS PROGRAMMING – Snooker App Commentary --------------------------------------->


App Design Overview:
I aimed to make this game an exciting and simple snooker experience for players. I kept the rules easy to follow, focusing on the key elements that make snooker fun. The main concept involves the cue ball returning as a free ball after being potted, allowing users to strategically position it for their next shots. The scoring system comes into play when the red ball is pocketed.
Adding a unique twist, I included a consecutive potting check. If players successfully pot two red or colored balls in a row, the game triggers an alert and deducts points. This feature adds an extra challenge and encourages strategic thinking. To test players' skills further, the game prompts them with the color ball order after potting all the reds. Failing to follow this sequence leads to the replacement of color balls, each assigned with different scoring values.
For user interaction, I opted for the mouse-released function for shot visualization, providing a simple and intuitive way for users to control their shots. A shot indicator was introduced to guide users and display the direction of their ball's movement.

Extensions:
As an extension, here’s what I’ve implemented:
Start Page - The game starts with a page where players press enter to begin their snooker adventure. The mode page gives options for snooker, Oval snooker, and fun modes. Users can easily switch between these modes by clicking, making it accessible for players to choose their preferred gameplay style.
Dynamic Snooker elements - In the snooker mode, I introduced dynamic elements to elevate the gaming experience. The cue stick is not just a static line but is animated to create a more realistic feel. An energy bar was incorporated to provide a visual representation of the force applied to the cue ball, allowing players to gauge and control their shots more effectively.
Oval Snooker mode - a delightful variation featuring an oval board with four pockets. It shares the same mechanism as the classic snooker game, adding a new dimension to your playing experience.
A heads-up display (HUD) was implemented to keep players informed and engaged. It includes a score tracker, providing constant feedback on their performance. Instructions, accessible by pressing 5, offer guidance on gameplay, while pressing 4 opens up a detailed rule page for players to better understand the mechanics. Color ball order guides players on the sequence to pot colored balls.
Fun Arcade Mode - Players control a red rectangle representing the cue man on a mission to rescue green balls while avoiding menacing black adversaries. Lives are at stake, and players lose a life for every collision with a black ball or upon missing three green balls, accompanied by an explosive sound effect for black ball collisions with the cue man.
Combining these features aims to enhance the user experience, providing an enjoyable and engaging gameplay in my snooker game.

Reference:
1.	Measurements - https://en.wikipedia.org/wiki/Snooker
2.	Pictures - https://www.wallpaperflare.com/
3.	Sounds - https://pixabay.com/sound-effects/search/game/
4.	V-pattern - https://codepen.io/colaru/pen/xxxqPNV


*/
