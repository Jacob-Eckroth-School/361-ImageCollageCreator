
const fs = require('fs')
const { createCanvas,loadImage } = require('canvas')
const { randomBytes, randomInt } = require('crypto')

const width = 1200
const height = 1200

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#ffffff'
context.fillRect(0, 0, width, height)


var images = []

async function loadImages(imagePathArray){
    for(let i = 0; i < imagePathArray.length; i++){
            await loadImage(imagePathArray[i]).then(image => {
            images.push(image);
   
          
        })
    }
   

}

let imagePathArray = ["assets/1.jpeg","assets/2.jpeg","assets/3.jpeg","assets/4.jpeg","assets/5.jpeg","assets/6.jpeg","assets/1.jpeg","assets/2.jpeg","assets/3.jpeg","assets/4.jpeg","assets/5.jpeg","assets/6.jpeg","assets/1.jpeg","assets/2.jpeg","assets/3.jpeg","assets/4.jpeg","assets/5.jpeg","assets/6.jpeg","assets/1.jpeg","assets/2.jpeg","assets/3.jpeg","assets/4.jpeg","assets/5.jpeg","assets/6.jpeg"]

async function createCanvasAsync(){
   await loadImages(imagePathArray);
   placeImagesOnCanvas();
}


function placeImagesOnCanvas(){
    console.log(images);
    let horizontalSections,verticalSections;
    if(images.length < 3){
        horizontalSections = images.length;
    }else if(images.length < 8){
        horizontalSections = 3.
    }else{
        horizontalSections = 4.
    }
    if(images.length < 6){
        verticalSections = 1.;
    }else if(images.length < 9){
        verticalSections = 2.;
    }else{
        verticalSections = 3.;
    }
    let horizontalAdvance  = width / horizontalSections;
    console.log("Horizontal advance: ",horizontalAdvance);
    let verticalAdvance = height / verticalSections;
    
    var currentImageIndex = 0;
    while(true){
        for(var x = 0; x < horizontalSections; x++){
            for(var y = 0; y < verticalSections; y++){
                console.log("x:",x,"Y:",y);
                var placeX = x * horizontalAdvance + randomInt(0,horizontalAdvance);
                var placeY = y * verticalAdvance + randomInt(0,verticalAdvance);
                var currentImage = images[currentImageIndex];
           
                var wToH = currentImage.width / currentImage.height;
          
                let newHeight, newWidth;
                if(images.width > images.height){
                    console.log("width > height");
                    newWidth = horizontalAdvance *  (randomInt(7,10) * .1);
                    
                    newHeight = newWidth / wToH;
                }else{
                    console.log("height < width");
                    newHeight = verticalAdvance  *  (randomInt(7,10) * .1); ;
                    newWidth = newHeight * wToH;
                }
                if(placeX + newWidth > width){
                    placeX = width - newWidth;
                }
                if(placeY + newHeight > height){
                    placeY = height - newHeight;
                }
                console.log("Drawing with x: ",placeX," Y: ",placeY, "New Width: ",newWidth," and height:",newHeight);
                context.drawImage(currentImage,placeX,placeY,newWidth,newHeight);
                

                currentImageIndex++;
                if(currentImageIndex >= images.length){
                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync('./test2.png', buffer)
                    return;
                }
            }
            
        }
       
    }
 


}






createCanvasAsync();