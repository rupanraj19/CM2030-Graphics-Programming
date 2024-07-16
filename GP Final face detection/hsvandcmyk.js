// <------------------------------------------- HSV AND CMYK ------------------------------------------>

function hsvConversion(img, threshold) {
    var imgCopy = img.get();
    imgCopy.loadPixels();

    var hsvImgWithThreshold = createImage(imgCopy.width, imgCopy.height);
    var hsvImgWithoutThreshold = createImage(imgCopy.width, imgCopy.height);

    hsvImgWithThreshold.loadPixels();
    hsvImgWithoutThreshold.loadPixels();

    for (var y = 0; y < imgCopy.height; y++) {
        for (var x = 0; x < imgCopy.width; x++) {
            var pixelIndex = ((imgCopy.width * y) + x) * 4;
            var pixelRed = imgCopy.pixels[pixelIndex + 0];
            var pixelGreen = imgCopy.pixels[pixelIndex + 1];
            var pixelBlue = imgCopy.pixels[pixelIndex + 2];
            var pixelAlpha = imgCopy.pixels[pixelIndex + 3];

            var hsv = rgbToHsv(pixelRed, pixelGreen, pixelBlue);
            var avgBrightness = (pixelRed + pixelGreen + pixelBlue) / 3;

            // Apply thresholding
            if (avgBrightness< threshold) {
                // Display hue as red, saturation as green, value as blue
                hsvImgWithThreshold.pixels[pixelIndex + 0] = hsv[0] * 1.5;
                hsvImgWithThreshold.pixels[pixelIndex + 1] = hsv[1] * 1.5;
                hsvImgWithThreshold.pixels[pixelIndex + 2] = hsv[2] * 1.5;
                hsvImgWithThreshold.pixels[pixelIndex + 3] = pixelAlpha;
            } else {
                // Below threshold, set pixel to black
                hsvImgWithThreshold.pixels[pixelIndex + 0] = pixelRed;
                hsvImgWithThreshold.pixels[pixelIndex + 1] = pixelGreen;
                hsvImgWithThreshold.pixels[pixelIndex + 2] = pixelBlue;
                hsvImgWithThreshold.pixels[pixelIndex + 3] = pixelAlpha;
            }

            // Without thresholding
            hsvImgWithoutThreshold.pixels[pixelIndex + 0] = hsv[0] * 1.5;
            hsvImgWithoutThreshold.pixels[pixelIndex + 1] = hsv[1] * 1.5;
            hsvImgWithoutThreshold.pixels[pixelIndex + 2] = hsv[2] * 2;
            hsvImgWithoutThreshold.pixels[pixelIndex + 3] = pixelAlpha;
        }
    }
    hsvImgWithThreshold.updatePixels();
    hsvImgWithoutThreshold.updatePixels();

    return [hsvImgWithThreshold, hsvImgWithoutThreshold];
}

function rgbToHsv(r, g, b) {
    // Normalize RGB values
    r = r / 255;
    g = g / 255;
    b = b / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    var h, s, v;

    // Hue calculation
    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / delta) % 6;
    } else if (max === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Saturation calculation
    if (max === 0) {
        s = 0;
    } else {
        s = delta / max;
    }
    s = Math.round(s * 100);

    // Value calculation
    v = Math.round(max * 100);

    return [h, s, v];
}


function cmykConversion(img, threshold) {
    var imgCopy = img.get();
    imgCopy.loadPixels();

    var cmykImgWithThreshold = createImage(imgCopy.width, imgCopy.height);
    var cmykImgWithoutThreshold = createImage(imgCopy.width, imgCopy.height);

    cmykImgWithThreshold.loadPixels();
    cmykImgWithoutThreshold.loadPixels();

    for (var y = 0; y < imgCopy.height; y++) {
        for (var x = 0; x < imgCopy.width; x++) {
            var pixelIndex = ((imgCopy.width * y) + x) * 4;
            var pixelRed = imgCopy.pixels[pixelIndex + 0];
            var pixelGreen = imgCopy.pixels[pixelIndex + 1];
            var pixelBlue = imgCopy.pixels[pixelIndex + 2];
            var pixelAlpha = imgCopy.pixels[pixelIndex + 3];

            var cmyk = rgbToCmyk(pixelRed, pixelGreen, pixelBlue);
            var avgBrightness = (pixelRed + pixelGreen + pixelBlue) / 3;

            // Apply thresholding
            if (avgBrightness < threshold) {
                // Display cyan as red, magenta as green, yellow as blue, and black as white
                cmykImgWithThreshold.pixels[pixelIndex + 0] = cmyk[0] * 255; // Cyan
                cmykImgWithThreshold.pixels[pixelIndex + 1] = cmyk[1] * 255; // Magenta
                cmykImgWithThreshold.pixels[pixelIndex + 2] = cmyk[2] * 255; // Yellow
                cmykImgWithThreshold.pixels[pixelIndex + 3] = 255; // Black
            } else {
                // Below threshold, set pixel to black
                cmykImgWithThreshold.pixels[pixelIndex + 0] = pixelRed;
                cmykImgWithThreshold.pixels[pixelIndex + 1] = pixelGreen;
                cmykImgWithThreshold.pixels[pixelIndex + 2] = pixelBlue;
                cmykImgWithThreshold.pixels[pixelIndex + 3] = pixelAlpha;
            }

            // Without thresholding
            cmykImgWithoutThreshold.pixels[pixelIndex + 0] = cmyk[0] * 255;
            cmykImgWithoutThreshold.pixels[pixelIndex + 1] = cmyk[1] * 255;
            cmykImgWithoutThreshold.pixels[pixelIndex + 2] = cmyk[2] * 255;
            cmykImgWithoutThreshold.pixels[pixelIndex + 3] = cmyk[3] * 255;
        }
    }
    cmykImgWithThreshold.updatePixels();
    cmykImgWithoutThreshold.updatePixels();

    return [cmykImgWithThreshold, cmykImgWithoutThreshold];
}

function rgbToCmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
  
    let k = Math.min(c, m, y);
    if (k === 1) {
      c = m = y = 0;
    } else {
      c = (c - k) / (1 - k);
      m = (m - k) / (1 - k);
      y = (y - k) / (1 - k);
    }
  
    return [c, m, y, k]; //cyan , magenta, yellow, key(black)
  }

