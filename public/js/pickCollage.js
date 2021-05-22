

var blankCollage = document.getElementById("blankCollage")


var textCollage = document.getElementById("textCollage")

var strokeCollage = document.getElementById("strokeCollage")

blankCollage.addEventListener("click",()=>{
    goToResultPage("blank")
})

textCollage.addEventListener("click",()=>{
    goToResultPage("text")   
})

strokeCollage.addEventListener("click",()=>{
    goToResultPage("stroke")
})

function goToResultPage(type){
   var title =  window.location.pathname.split("/").pop();
   window.location.replace("/result/"+title+"/"+type)
}

var backButton = document.getElementById("backButton");

backButton.addEventListener("click",function(){
    var title =  window.location.pathname.split("/").pop();
    window.location.replace("/uploadImages/"+title)
})
