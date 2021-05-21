


var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click",sendImages);


async function sendImages(){
    var totalImages = 0;
    var imagesProcessed = 0;
    for(const [key, imageURL] of Object.entries(images)){
        if(imageURL === null){
            continue;
        }else{
            totalImages+=1;
        }
    }
    var sendBody = {
        "imageAmount":0,
        "collageTitle":document.querySelector(".collageTitle").textContent,
        "images":[]
    }
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        imagesProcessed++;
        sendBody.imageAmount++;
        var array = sendBody["images"];
        array.push(reader.result);
        sendBody.images = array;

        if(imagesProcessed === totalImages){
            sendBodyFunction(sendBody);
        }
      }, false);
    for(const [key, imageURL] of Object.entries(images)){
        if(imageURL === null){
            continue;
        }else{
            let blob = await fetch(imageURL).then(
                r => r.blob()
            );
            reader.readAsDataURL(blob);
            

             
              
  
          
        }
    }

    
    
}


function sendBodyFunction(sendBody){

    var postRequest = new XMLHttpRequest();
    postRequest.open("post","/uploadImages",true);
    postRequest.addEventListener("load",function(event){
        if(event.target.status === 200){
           
            window.location.replace("/collageType/"+sendBody.collageTitle);
           
        }else{
            console.log("we are not in business");
        }
    })
    postRequest.setRequestHeader('Content-Type', 'application/json');
    var send = JSON.stringify(sendBody);
    postRequest.send(send);
}
