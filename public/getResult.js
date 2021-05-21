

loadResult(window.location.pathname.split("/"));

function loadResult(title){
    var style
    var collageTitle
    if(title.length !== 4){
        alert("this is an incorrect url.")
        return;
    }else{
        style = title.pop();
        collageTitle = title.pop();
        if(style != "stroke" && style != "blank" && style != "text"){
            alert("this is an incorret url")
            return;
        }
        
    }
   
    console.log("Style:",style)
    console.log("COllage Title:",collageTitle)

    context={
        collageTitle:collageTitle,
        collageStyle:style
        
    }
    var resultHTML = Handlebars.templates.resultDisplay(context);
    document.getElementById("goAgainHolder").insertAdjacentHTML('beforebegin',resultHTML);
}


document.getElementById("goAgainButton").addEventListener("click",function(){
    window.location.href="/"
})