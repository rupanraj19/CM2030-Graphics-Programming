// <-------------------------------------GREYSCALE-------------------------------------------->

function greyscale(img) {

    var imgCopy = img.get();
    imgCopy.loadPixels();
    var brightnessFactor = 1.2;

    for (var y = 0; y < imgCopy.height; y++) {
        for (var x = 0; x < imgCopy.width; x++) {
            
            var pixelIndex = ((imgCopy.width * y) + x) * 4;
            
            // Extract RGB and alpha values of the current pixel
            var pixelRed = imgCopy.pixels[pixelIndex + 0];
            var pixelGreen = imgCopy.pixels[pixelIndex + 1];
            var pixelBlue = imgCopy.pixels[pixelIndex + 2];
            var pixelAlpha = imgCopy.pixels[pixelIndex + 3];
        
            var grey = (pixelRed + pixelGreen + pixelBlue) / 3;  // Convert RGB to greyscale
            grey = min(255, grey * brightnessFactor);  // Apply brightness factor
            
            // Update RGB values of the pixel to the greyscale value
            imgCopy.pixels[pixelIndex + 0] = grey;
            imgCopy.pixels[pixelIndex + 1] = grey;
            imgCopy.pixels[pixelIndex + 2] = grey;
        }
    }
    
    imgCopy.updatePixels(); // Update the pixels of the copied image
    return imgCopy; // Return the greyscaled image
}
