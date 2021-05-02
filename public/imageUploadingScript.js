// import 'cropperjs/dist/cropper.css';
//import Cropper from '/cropperjs/cropperjs';////

const image = document.getElementById('image');
const cropper = new Cropper(image, {
  viewMode:1,
  movable:false,
  zoomable:false,
  minCropBoxWidth:100,
  minCropBoxHeight:100
});