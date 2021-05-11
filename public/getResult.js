

loadResult(window.location.pathname.split("/").pop());

function loadResult(title){

    context={
        collageTitle:title
    }
    var resultHTML = Handlebars.templates.resultDisplay(context);
    document.getElementById("goAgainHolder").insertAdjacentHTML('beforebegin',resultHTML);
}


document.getElementById("goAgainButton").addEventListener("click",function(){
    window.location.href="/"
})