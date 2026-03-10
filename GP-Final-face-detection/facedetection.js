// <---------------------------------------FACE DETECTION--------------------------------------------->

var detector;
var classifier = objectdetect.frontalface;
var faces;
var face, faceImg;
var scaleFactor;

function faceDetection(capture){    
    faceImg = capture.get(); // Get the current frame from the video capture
    faces = detector.detect(faceImg.canvas); // Detect faces in the captured frame

    // Loop through each detected face
    for (var i = 0; i < faces.length; i++){ 
        face = faces[i];
        // Check if the detected face meets a certain threshold
        if (face[4] > 4){
            var faceArea = createImage(int(face[2]), int(face[3])); // Create an image of the detected face area
            let getFace = faceImg.get(face[0], face[1], face[2], face[3]);
            faceArea.set(0, 0, getFace);
        }
    }
    return faceArea; // Return the image of the detected face area
}

