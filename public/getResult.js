

loadResult('title');

function loadResult(title){
    context={
        collageTitle:title
    }
    var resultHTML = Handlebars.templates.resultDisplay(context);
    document.getElementById("goAgainHolder").insertAdjacentHTML('beforebegin',resultHTML);
}