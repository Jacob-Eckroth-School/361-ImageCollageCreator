
const fs = require('fs')
const { createCanvas,loadImage } = require('canvas')

const width = 1200
const height = 600

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#ff0000'
context.fillRect(0, 0, width, height)


var images = []

async function loadImages(imagePathArray){
    for(let i = 0; i < imagePathArray.length; i++){
        loadImage(imagePathArray[i]).then(image => {
            images.push(image);
            console.log(images);
            placeImageOnCanvas(images[i]);
        })
    }

}

function placeImageOnCanvas(image){
    console.log(image.width);
    console.log(image.height);
    console.log("Width - height ratio: " ,image.width/image.height);

}


let imagePathArray = ["assets/1.jpeg","assets/2.jpeg","assets/3.jpeg"]

loadImages(imagePathArray);




