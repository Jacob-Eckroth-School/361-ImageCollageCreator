// import 'cropperjs/dist/cropper.css';
//import Cropper from '/cropperjs/cropperjs';////

var images = {}

var imageCount = 0;

var uploadButton = document.getElementById("uploadButton")


uploadButton.addEventListener("click",uploadImage);
var imgUpload = document.getElementById("imgupload");
imgUpload.addEventListener('change',function(){
    if(this.files && this.files[0]){
        if(!(this.files[0].type.match('image.*'))){
            alert("Please only upload image files") //make this look nice later
            return;
        }
        src = URL.createObjectURL(this.files[0]); // set src to blob url
        var newID = this.files[0].name + imageCount + Math.floor(Math.random() * 10000)
        images[newID] = src;
    
        

        var context ={
            alt:"A Picture",
            animalImage:images[newID],
            imageID:newID
        }
        imageCount++;
        var photoHTML = Handlebars.templates.imageDisplay(context);
        
        document.getElementById("photoHolder").insertAdjacentHTML('beforeend',photoHTML);
        
        var insertedImage = document.getElementById("photoHolder").children[document.getElementById("photoHolder").children.length -1];
        var buttonsHolder = insertedImage.children[insertedImage.children.length-1];
        var cropButton = buttonsHolder.children[0];
        var deleteButton=buttonsHolder.children[1];
        deleteButton.addEventListener("click",function(){
            attemptDelete(newID)
        });
        cropButton.addEventListener("click",function(){
            attemptCrop(newID);
        });
    

        
        imgUpload.value='';
    }
});

function attemptDelete(imageID){

   
   
    var removingElement = document.getElementById(imageID);

    document.getElementById("photoHolder").removeChild(removingElement);
    imageCount--;
    images[imageID] = null;
}
function attemptCrop(imageID){
    console.log("Crop ",document.getElementById(imageID));
}

function uploadImage(){
    
    imgUpload.click();

}
//https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
