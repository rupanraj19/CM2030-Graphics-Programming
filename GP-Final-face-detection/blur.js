//<------------------------------------------------GAUSSIAN BLUR----------------------------------------------------------------->

function gaussianBlur(img, sigma) {

    var imgCopy = img.get();
    imgCopy.loadPixels();
    var kernelSize = 9; 
    var kernel = createGaussianKernel(kernelSize, sigma);
    // Apply convolution with the Gaussian kernel
    for (var x = 0; x < imgCopy.width; x++) {
        for (var y = 0; y < imgCopy.height; y++) {
            var pixelIndex = (x + y * imgCopy.width) * 4;
            // Apply convolution to each channel (RGBA)
            for (var channel = 0; channel < 3; channel++) { // Loop through RGB channels
                var blurredValue = 0;
                // Apply kernel to the neighborhood of the pixel
                for (var i = 0; i < kernelSize; i++) {
                    for (var j = 0; j < kernelSize; j++) {
                        var xOffset = j - Math.floor(kernelSize / 2);
                        var yOffset = i - Math.floor(kernelSize / 2);
                        var neighborX = x + xOffset;
                        var neighborY = y + yOffset;
                        // Clamp to image boundaries
                        neighborX = constrain(neighborX, 0, imgCopy.width - 1);  
                        neighborY = constrain(neighborY, 0, imgCopy.height - 1);
                        var neighborIndex = (neighborX + neighborY * imgCopy.width) * 4; // Calculate the index of the neighbor pixel
                        var neighborValue = imgCopy.pixels[neighborIndex + channel];  // Get the value of the neighbor pixel in the specified channel
                        var kernelValue = kernel[i][j]; // Apply the kernel value to the neighbor pixel
                        blurredValue += kernelValue * neighborValue;
                    }
                }
                // Update the pixel value with the blurred value
                imgCopy.pixels[pixelIndex + channel] = blurredValue;
            }
        }
    }

    imgCopy.updatePixels(); // Update pixels of the copied image
    return imgCopy; // Return the blurred image
}

function createGaussianKernel(size, sigma) {
    var kernel = [];
    var sum = 0;

    // Generate the kernel values using the Gaussian function
    for (var i = 0; i < size; i++) {
        kernel[i] = [];
        for (var j = 0; j < size; j++) {
            var x = i - Math.floor(size / 2);
            var y = j - Math.floor(size / 2);
            kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
            sum += kernel[i][j];
        }
    }
    for (var i = 0; i < size; i++) {  // Normalize the kernel values
        for (var j = 0; j < size; j++) {
            kernel[i][j] /= sum;
        }
    }

    return kernel;
}

function convolution(x, y, matrix, img) {
    var matrixSize = matrix.length;
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);
    
    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color as an array
    return [totalRed, totalGreen, totalBlue];
}

