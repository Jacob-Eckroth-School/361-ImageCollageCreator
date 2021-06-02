
var inputBox = document.getElementById("title");

const maxLetters = 30;




inputBox.addEventListener('input',function(){


    var lettersLeft = document.getElementById("lettersLeft");
    var length = inputBox.value.length;
    var remainingLetters = maxLetters - length;
    var lettersLeft = document.getElementById("lettersLeft");
    lettersLeft.textContent = "(" + remainingLetters + ")"
    if(!canSubmit()){
        lettersLeft.style.color = "#bf1e2e"
        updateButton(false);
    }else{
        lettersLeft.style.color = "#056839"
        updateButton(true);
    }
    

})

function canSubmit(){
    var length = inputBox.value.length;
    var remainingLetters = maxLetters - length;
    
    if(remainingLetters < 0 || remainingLetters == maxLetters){
        return false;
    }else{
        return true;
    }
}


function updateButton(isButtonActive){
    continueButton = document.getElementById("clickButton");
    if(isButtonActive){
        continueButton.style.backgroundColor = "#2bb673"
        continueButton.style.color = "white";
        continueButton.style.boxShadow = "3px 3px 6px rgb(46, 46, 46)"
        continueButton.style.hover = "pointer";
    }else{
        continueButton.style.backgroundColor = "#818285"
        continueButton.style.color="black";
        continueButton.style.boxShadow = "none";
        continueButton.style.hover ="cursor";

    }
}

var button = document.getElementById("clickButton");
clickButton.addEventListener("click",attemptSubmit);

function attemptSubmit(){
    if(canSubmit()){
        var collageTitle = inputBox.value;
        window.location.href = '/uploadImages/'+collageTitle;   
    }
}