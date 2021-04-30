var testButton = document.getElementById("testButton");
testButton.addEventListener("click",function(){
    var context = {
        animalImage:"http://placekitten.com/200/300"
    }
    var photoHTML = Handlebars.templates.imageDisplay(context);
    document.getElementById("photoHolder").insertAdjacentHTML('beforeend',photoHTML);

})