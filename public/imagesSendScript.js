

var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click",sendImages);


async function sendImages(){
    console.log(images);

    var sendBody = {
        "imageAmount":0,
        "collageTitle":document.querySelector(".collageTitle").textContent,
        "images":[]
    }
    const reader = new FileReader();
    var totalProcessed = 0
    var totalNeedToProcess = images.length;
    console.log(totalNeedToProcess);
    for(const [key, imageURL] of Object.entries(images)){
        if(imageURL === null){
            totalProcessed++;
            continue;
        }else{
            let blob = await fetch(imageURL).then(
                r => r.blob()
            );

            
            let reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = function() {
                totalProcessed++;
               
                var array = sendBody["images"]
                array.push(reader.result);
                sendBody["images"] = array
            
                sendBody["imageAmount"] = array.length
                if(totalProcessed === totalNeedToProcess){
                    console.log("it does");
                    sendBodyFunction(sendBody);
                }else{
                    console.log("it doesn't")
                }

            };
              
  
          
        }
    }
    
    
}


function sendBodyFunction(sendBody){

    var postRequest = new XMLHttpRequest();
    postRequest.open("post","/getCollage",true);
    postRequest.addEventListener("load",function(event){
        if(event.target.status === 200){
            console.log("we're in business");
        }
    })
    postRequest.setRequestHeader('Content-Type', 'application/json');
    var send = JSON.stringify(sendBody);
    console.log(send);
    postRequest.send(send);
}