// <---------------------------------------------- MAIN SKETCH ------------------------------------>

var capture, capturedImage;
var img;
var redSlider, greenSlider,blueSlider;
var screenshotButton, gameButton, funModeButton, playButton, backButton;
var hsvSlider, cmykSlider;
var w = 160,
    h = 120;
var effects;
var hatImg; 
var cat,  gamebg, warrior;
var catchMusic, bgMusic;
var mode = "default";

// <-------------------------------------- PRELOAD AND SETUP ------------------------------------>
function preload() {
    // Load images and sounds
    bg = loadImage("assets/bg.png");
    hen = loadImage("assets/hen.png");
    eggImg = loadImage("assets/egg.png");
    hatImg = loadImage("assets/hat.png");
    warrior = loadImage("assets/warrior.png");
    gamebg = loadImage("assets/gamebg.jpg");

    catchMusic = loadSound("assets/catch.mp3");
}

function setup() {
    createCanvas(1000, 1000); // Set up the canvas
    pixelDensity(1);
    initDefaultMode(); // Initialize the default mode
}

// <-------------------------------------- MODES ------------------------------------------->
function initDefaultMode() {
    // Initialize default mode settings
    mode = "default";
    clearSetup(); // Clear previous setup if any

    // Create sliders for color adjustment
    redSlider = createSlider(0, 256, 80);
    redSlider.position(15, 4.4 * h);

    greenSlider = createSlider(0, 256, 80);
    greenSlider.position(w + 25, 4.4 * h);

    blueSlider = createSlider(0, 256, 80);
    blueSlider.position(2 * w + 35, 4.4 * h);

    // Create sliders for HSV and CMYK adjustments
    hsvSlider = createSlider(0, 256, 0);
    hsvSlider.position(w + 25, 7 * h);

    cmykSlider = createSlider(0, 256, 0);
    cmykSlider.position(2 * w + 35, 7 * h);

    // Create buttons for different functionalities
    screenshotButton = createButton('Take Screenshot');
    screenshotButton.position(width - 200, 300);
    screenshotButton.mousePressed(runAgain);

    gameButton = createButton("Switch to Game Mode");
    gameButton.position(width - 200, 350);
    gameButton.mousePressed(startGame);

    funModeButton = createButton("Switch to Fun Mode");
    funModeButton.position(width - 200, 400);
    funModeButton.mousePressed(funMode);

    // Create video capture and initialize face detection
    capture = createCapture(VIDEO);
    capture.size(w, h);
    capture.hide();

    scaleFactor = 1.2;
    detector = new objectdetect.detector(w, h, scaleFactor, classifier);
}

function initGameMode() {
    mode = "gameMode";
    clearSetup(); // Clear previous setup if any

    createCanvas(800, 600);
    pixelDensity(1);
    capture = createCapture(VIDEO);
    capture.size(w, h);
    capture.hide();

    scaleFD = 1.2;
    detector = new objectdetect.detector(w, h, scaleFactor, classifier);
    faceImgForGame = createImage(w, h);
}

function initFunMode()
{
    mode = "funMode";
    clearSetup(); // Clear previous setup if any

    createCanvas(1200, 1200);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide()
    
   
   cat = createVideo("assets/cat.mp4");
   
    playButton = createButton("video");
    playButton.position(width - 300, 0);
    playButton.mousePressed(toggleVid)

    funButton = createButton("start game");
    funButton.position(width - 200, 0);
    funButton.mousePressed(toggleGameState)

    backButton = createButton("back");
    backButton.position(width - 100, 0);
    backButton.mousePressed(goBack)

    faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
    };
    // ml5 poseNet 
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);
    background(0);
}

// <-------------------- CLEAR AND REPLACE SETUP -------------------------------------->
function clearSetup() {
    // Clear all UI elements from the canvas
    if (redSlider) redSlider.remove();
    if (greenSlider) greenSlider.remove();
    if (blueSlider) blueSlider.remove();
    if (hsvSlider) hsvSlider.remove();
    if (cmykSlider) cmykSlider.remove();
    if (screenshotButton) screenshotButton.remove();
    if (gameButton) gameButton.remove();
    if (funModeButton) funModeButton.remove();
}

function startGame() {
    mode = "gameMode"; // Change the mode to game mode
    initGameMode(); // Initialize the game mode
}

function funMode()
{
    mode = "funMode"; // Change the mode to expression
    initFunMode()
}

// <----------------------------- SCREENSHOT AND PLAYBACK -------------------------------->
function takeScreenshot() {
    capturedImage = capture.get();
    capturedImage.resize(w, h);
    return capturedImage;
}

function runAgain() {
    takeScreenshot();
    capture = createCapture(VIDEO);
    capture.hide();
}

// <----------------------------------- MAIN DRAW ------------------------------------->
function draw() {
    if(mode =="default")
    {
        drawFilterMode();
    }
    if (mode == "gameMode") 
    {
        drawGameWorld();
    } 
    if(mode == "funMode")
    {
        drawFunWorld();

    }
}

// <---------------------------------- FILTERMODE ----------------------------->
function drawFilterMode() {
    background(125);

    // Display the video capture
    image(capture, width - 300, 100, 240, 180);
    text("Greyscale with brightness", w + 20, h - 30);
    text("red channel", 10, 2 * h + 10)
    text("green channel", w + 20, 2 * h + 10)
    text("blue channel", 2 * w + 30, 2 * h + 10)
    text("red channel Threshold: "+ redSlider.value(), 10, 3.3 * h + 10)
    text("green channel Threshold: "+ greenSlider.value() , w + 20, 3.3 * h + 10)
    text("blue channel Threshold: "+ blueSlider.value(), 2 * w + 30, 3.3 * h + 10)
    text("Webcam Image", 10, 4.6 * h + 10)
    text("RGB to HSV Threshold: "+ hsvSlider.value(), w + 20, 5.9 * h + 10)
    text("RGB to HSV", w + 20, 4.6 * h + 10)
    text("RGB to CMYK Threshold: " + cmykSlider.value(), 2 * w + 30, 5.9 * h + 10)
    text("RGB to CMYK", 2 * w + 30, 4.6 * h + 10)
    text("Face Detection", 10, 5.9 * h + 10)
    text("Select a number to apply an effect: \n1.Greyscale\n2.CMYK\n3.HSV\n4.pixelated\n5.Gaussianblur",10, 7.2*h)
    // Display the captured image if available
    if (capturedImage) {
        image(capturedImage, 10, h-20, w, h);
        image(greyscale(capturedImage), w + 20, h-20, w, h);
        
        // rgb
        image(rgbChannels(capturedImage)[0], 10, 2 * h + 20, w, h);
        image(rgbChannels(capturedImage)[1], w + 20, 2 * h + 20, w, h);
        image(rgbChannels(capturedImage)[2], 2 * w + 30, 2 * h + 20, w, h);

        // rgb with threshold
        image(rgbWithThreshold(capturedImage)[0], 10, 3.3 * h + 20, w, h);
        image(rgbWithThreshold(capturedImage)[1], w + 20, 3.3 * h + 20, w, h);
        image(rgbWithThreshold(capturedImage)[2], 2 * w + 30, 3.3 * h + 20, w, h);

        // hsb and cymk
        image(capturedImage, 10, 4.6 * h + 20, w, h);

        var threshold = hsvSlider.value();
        var [hsvImgWithThreshold, hsvImgWithoutThreshold] = hsvConversion(capturedImage, threshold);
        image(hsvImgWithThreshold, w + 20, 5.9 * h + 20, w, h);     // Display the HSB image with threshold
        image(hsvImgWithoutThreshold, w + 20, 4.6 * h + 20, w, h);   // Display the HSB image without threshold

        var threshold2 = cmykSlider.value();
        var [cmykImgWithThreshold, cmykImgWithoutThreshold] = cmykConversion(capturedImage, threshold2);
        image(cmykImgWithThreshold, 2 * w + 30, 5.9 * h + 20, w, h);  // Display the CMYK image with threshold
        image(cmykImgWithoutThreshold, 2 * w + 30, 4.6 * h + 20, w, h);  // Display the CMYK image without threshold
       
        // facedetection
        img = faceDetection(capturedImage);
        image(capturedImage, 10, 5.9 * h + 20, w, h, 0, 0, windowWidth, windowHeight);
      
        translate(10, 5.9 * h + 20);
        push()
        if (effects) {
            image(effects, face[0], face[1], face[2], face[3], 0, 0, windowWidth, windowHeight);
        }
        pop()
    }
}

function keyPressed() {
    switch (keyCode) {
        case 49: // 1
            effects = greyscale(img);
            break;
        case 50: // 2
            effects = cmykConversion(img, cmykSlider.value())[1];
            break;
        case 51: // 3
            effects = hsvConversion(img, hsvSlider.value())[1];
            break;
        case 52: // 4
            effects = pixelated(img);
            break;
        case 53: // 5
            effects = gaussianBlur(img,20);
            break;   
        default:
            effects = null;
            break;
    }

}

/*-----------------------------------GRAPHICS PROGRAMMING - FINAL-----------------------------------------------

Project Overview:
For this project, I'll be developing an image processing application that relies on the webcam for a range of exciting functionalities. I'll be experimenting with tasks such as image segmentation and color space conversions. Additionally, I'll implement face detection features with filters like face blur or pixelation. On top of that, I'll be adding two more extensions: one is a game, and the other is a fun mode. It's all about exploring image processing while making the most out of webcam technology!

Findings on Image Segmentation using Color Channels:
During the image segmentation process, I explored the utilization of various color spaces such as HSV (Hue, Saturation, Value) and CMYK (Cyan, Magenta, Yellow, Black). These color spaces were chosen for their effectiveness in segmenting images based on different color characteristics.

Challenges Encountered and Solutions Implemented:
One major challenge I encountered was managing the segmentation functions efficiently. Initially, I had separate functions for each color segment, with and without thresholding. However, consolidating these functions into a single one posed difficulties, particularly in returning and calling them within the drawing process. After conducting thorough research, I addressed this issue by returning the segmentation results as an array and then calling them using indices in the drawing function. This approach streamlined the code and improved its maintainability.

Progress Toward Project Completion:
In progressing towards completing the project objectives, I encountered significant challenges, particularly with implementing the extension feature. The focus was on integrating a fun mode allowing users to draw using hand movements, reminiscent of childhood games. However, a major obstacle emerged from the constant refreshing of the background in each frame, disrupting the seamless drawing experience.

The main issue stemmed from the need to refresh the background to prevent other elements like draw boxes, landmarks, and pose from being overwritten. However, I also needed the drawing from the right hand to be overwritten to appear as lines. Despite multiple attempts, I couldn't find a satisfactory solution to reconcile these conflicting requirements.

Uniqueness of the Extension Idea:
First Extension, I utilized the objectdetect.js library to detect facial features, specifically the head. Drawing inspiration from my childhood memories, I recreated the classic game "Hen Catch Eggs" with a modern twist. Using facial detection technology for movement controls adds a novel dimension to the gameplay. Players control a hen to catch falling eggs while avoiding missing three. It's a simple yet engaging game that seamlessly blends nostalgia with technology for a delightful gaming experience.
 
Second extension: With the hand-drawing challenge still persisting, I opted for a different direction and created a fighting game experience. In this iteration, players engage in dynamic battles against formidable opponent, utilizing a range of combat moves to secure victory. Every 10 seconds, the opponent throws objects, making the game harder and needing quick reactions. Additionally, I included entertaining videos for players to mimic, adding an element of amusement and engagement to the gameplay.


References:

Images - https://www.canva.com/
Video - https://youtu.be/mtv-LQTemMk?feature=shared, https://youtu.be/NgpIRBOOFTg?feature=shared
PoseNet - https://youtu.be/OIo-DIOkNVg?feature=shared
Music - https://pixabay.com/

*/
