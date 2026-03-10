//<-------------------------------------------------- PIXELATED -----------------------------------------------------> 

function pixelated(img){

var pixelatedSize = 10;
//load image pixel values into array pixels
var imgCopy = img.get();
imgCopy.loadPixels();

//process block by block
for(var y=0;y<img.height;y+=pixelatedSize){
    for(var x=0;x<img.width;x+=pixelatedSize){

        var sumRed = 0;
        var sumGreen = 0;
        var sumBlue = 0;
        
        //get the sum of RGB of that block
        for(var i=0;i<pixelatedSize;i++){
            for(var j=0;j<pixelatedSize;j++){
                var pixelIndex = ((img.width * (y+j)) + (x+i))*4;
                var pixelRed = imgCopy.pixels[pixelIndex + 0];
                var pixelGreen = imgCopy.pixels[pixelIndex + 1];
                var pixelBlue = imgCopy.pixels[pixelIndex + 2];
                sumRed+=pixelRed;
                sumGreen+=pixelGreen;
                sumBlue+=pixelBlue;
            }
        }
        //calcualte the ave of RGB of that block
        var aveRed = sumRed/(pixelatedSize*pixelatedSize);
        var aveGreen = sumGreen/(pixelatedSize*pixelatedSize);
        var aveBlue = sumBlue/(pixelatedSize*pixelatedSize);
        
            //paint the block with the ave RGB value
            for(var i=0;i<pixelatedSize;i++){
                for(var j=0;j<pixelatedSize;j++){
                    var pixelIndex = ((imgCopy.width * (y+j)) + (x+i))*4;
                    imgCopy.pixels[pixelIndex + 0] = aveRed;
                    imgCopy.pixels[pixelIndex + 1] = aveGreen;
                    imgCopy.pixels[pixelIndex + 2] = aveBlue;
                            }
                        }
                    }
                }
    imgCopy.updatePixels();
    return imgCopy;
}
