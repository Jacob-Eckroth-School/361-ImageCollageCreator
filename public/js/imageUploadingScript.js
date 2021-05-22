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
        var newID = generateID(this.files[0].name)
        
       
        images[newID] = src;
        createCropWindow(newID,false);

        
        imgUpload.value='';
    }
});

function generateID(name){
    return name + imageCount + Math.floor(Math.random() * 10000)
}
function addImage(newID,imageExistsAlready){
    if(!imageExistsAlready){
        imageCount++;
    }
  
    var context = {
        animalImage:images[newID],
        alt:"a photo",
        imageID:newID

    }
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
    toggleSendDisplay();
}


function createCropWindow(newID,imageExistsAlready){
    var context = {
        imgSrc:images[newID]
    }
    var cropHTML = Handlebars.templates.cropImage(context);
    document.body.insertAdjacentHTML('beforeend',cropHTML);
    const image = document.getElementById("cropImg");
    const cropper = new Cropper(image, {
        movable:false,
        rotatable:false,
        scalable:false,
        zoomable:false,
        zoomOnTouch:false,
        zoomOnWheel:false,
        minCropBoxWidth:100,
        minCropBoxHeight:100,
        background:false,
        viewMode:2,
        modal:false
      });
      var cancelButton = document.getElementById("cancelCropButton");
      var submitButton = document.getElementById("submitCropButton");

      cancelButton.addEventListener("click",function(){
          cancelCrop(cropper,newID,imageExistsAlready);
      })
      submitButton.addEventListener("click",function(){
          submitCrop(cropper,newID,imageExistsAlready);
      })

}

function cancelCrop(cropper,newID,imageExistsAlready){
    document.body.removeChild(document.getElementById("cropHolder"))
    if(!imageExistsAlready){
        images[newID] = null;
    }
   
}

function submitCrop(cropper,newID,imageExistsAlready){
    var canvas = cropper.getCroppedCanvas().toBlob((blob)=>{
        var src = URL.createObjectURL(blob);
        if(imageExistsAlready){
            document.getElementById(newID).remove();
        }
        images[newID] = src;
        
        addImage(newID,imageExistsAlready);
    });
    document.body.removeChild(document.getElementById("cropHolder"))
}



function attemptDelete(imageID){

   
   
    var removingElement = document.getElementById(imageID);

    document.getElementById("photoHolder").removeChild(removingElement);
    imageCount--;
    images[imageID] = null;
    toggleSendDisplay();
}

function toggleSendDisplay(){
    if(imageCount <=0){
        document.getElementById("sendButton").style.display="none";
    }else{
        document.getElementById("sendButton").style.display="block";
    }
}
function attemptCrop(imageID){
    createCropWindow(imageID,true);
}

function uploadImage(){
    
    imgUpload.click();

}
//https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/


var backButton = document.getElementById("backButton")
backButton.addEventListener("click",function(){
    window.location.href="/"
})