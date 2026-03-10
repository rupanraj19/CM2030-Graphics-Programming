// <----------------------------------------------------RGB CHANNELS -------------------------------------------->

function rgbChannels(img) {
    // Create copies of the input image
    var imgCopy = img.get();
    imgCopy.loadPixels();

    // Create images for each RGB channel
    var redImg = createImage(imgCopy.width, imgCopy.height);
    redImg.loadPixels();
    var greenImg = createImage(imgCopy.width, imgCopy.height);
    greenImg.loadPixels();
    var blueImg = createImage(imgCopy.width, imgCopy.height);
    blueImg.loadPixels();

    // Process each pixel of the input image
    for (var y = 0; y < imgCopy.height; y++) {
        for (var x = 0; x < imgCopy.width; x++) {
            var pixelIndex = ((imgCopy.width * y) + x) * 4;
            var pixelRed = imgCopy.pixels[pixelIndex + 0];
            var pixelGreen = imgCopy.pixels[pixelIndex + 1];
            var pixelBlue = imgCopy.pixels[pixelIndex + 2];

            // Constrain pixel values to range [0, 255]
            pixelRed = constrain(pixelRed, 0, 255);
            pixelGreen = constrain(pixelGreen, 0, 255);
            pixelBlue = constrain(pixelBlue, 0, 255);
            // Red channel
            redImg.pixels[pixelIndex + 0] = pixelRed;
            redImg.pixels[pixelIndex + 1] = 0;
            redImg.pixels[pixelIndex + 2] = 0;
            redImg.pixels[pixelIndex + 3] = 255;
            // Green channel
            greenImg.pixels[pixelIndex + 0] = 0;
            greenImg.pixels[pixelIndex + 1] = pixelGreen;
            greenImg.pixels[pixelIndex + 2] = 0;
            greenImg.pixels[pixelIndex + 3] = 255;
            // Blue channel
            blueImg.pixels[pixelIndex + 0] = 0;
            blueImg.pixels[pixelIndex + 1] = 0;
            blueImg.pixels[pixelIndex + 2] = pixelBlue;
            blueImg.pixels[pixelIndex + 3] = 255;
        }
    }

    // Update pixel data for each channel image
    redImg.updatePixels();
    greenImg.updatePixels();
    blueImg.updatePixels();
    return [redImg, greenImg, blueImg];
}

function rgbWithThreshold(img) {
    // Create copies of the input image
    var imgCopy = img.get();
    imgCopy.loadPixels();

    // Create images for each RGB channel
    var redImg = createImage(imgCopy.width, imgCopy.height);
    redImg.loadPixels();
    var greenImg = createImage(imgCopy.width, imgCopy.height);
    greenImg.loadPixels();
    var blueImg = createImage(imgCopy.width, imgCopy.height);
    blueImg.loadPixels();

    // Process each pixel of the input image
    for (var y = 0; y < imgCopy.height; y++) {
        for (var x = 0; x < imgCopy.width; x++) {
            var pixelIndex = ((imgCopy.width * y) + x) * 4;
            var pixelRed = imgCopy.pixels[pixelIndex + 0];
            var pixelGreen = imgCopy.pixels[pixelIndex + 1];
            var pixelBlue = imgCopy.pixels[pixelIndex + 2];

            // Constrain pixel values to range [0, 255]
            pixelRed = constrain(pixelRed, 0, 255);
            pixelGreen = constrain(pixelGreen, 0, 255);
            pixelBlue = constrain(pixelBlue, 0, 255);

            // Red channel
            if (redSlider.value() < pixelRed) {
                redImg.pixels[pixelIndex + 0] = pixelRed;
                redImg.pixels[pixelIndex + 1] = pixelGreen;
                redImg.pixels[pixelIndex + 2] = pixelBlue;
                redImg.pixels[pixelIndex + 3] = 255;
            } else {
                redImg.pixels[pixelIndex + 0] = pixelRed;
                redImg.pixels[pixelIndex + 1] = 0;
                redImg.pixels[pixelIndex + 2] = 0;
                redImg.pixels[pixelIndex + 3] = 255;
            }

            // Green channel
            if (greenSlider.value() < pixelGreen) {
                greenImg.pixels[pixelIndex + 0] = pixelRed;
                greenImg.pixels[pixelIndex + 1] = pixelGreen;
                greenImg.pixels[pixelIndex + 2] = pixelBlue;
                greenImg.pixels[pixelIndex + 3] = 255;
            } else {
                greenImg.pixels[pixelIndex + 0] = 0;
                greenImg.pixels[pixelIndex + 1] = pixelGreen;
                greenImg.pixels[pixelIndex + 2] = 0;
                greenImg.pixels[pixelIndex + 3] = 255;
            }

            // Blue channel
            if (blueSlider.value() < pixelBlue) {
                blueImg.pixels[pixelIndex + 0] = pixelRed;
                blueImg.pixels[pixelIndex + 1] = pixelGreen;
                blueImg.pixels[pixelIndex + 2] = pixelBlue;
                blueImg.pixels[pixelIndex + 3] = 255;
            } else {
                blueImg.pixels[pixelIndex + 0] = 0;
                blueImg.pixels[pixelIndex + 1] = 0;
                blueImg.pixels[pixelIndex + 2] = pixelBlue;
                blueImg.pixels[pixelIndex + 3] = 255;
            }
        }
    }

    // Update pixel data for each channel image
    redImg.updatePixels();
    greenImg.updatePixels();
    blueImg.updatePixels();

    return [redImg, greenImg, blueImg];
}
