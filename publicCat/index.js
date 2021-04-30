

//yay javascript time

var requestCatButton = document.getElementById("catButton");
requestCatButton.addEventListener("click",getCatPhoto);

var requestDogButton = document.getElementById("dogButton");
requestDogButton.addEventListener("click",getDogPhoto);

function getCatPhoto(){
    //the request we are going to send to our server.
    var request = new XMLHttpRequest();
    var requestURL = '/giveMeACat' //this could be anything

    request.open('GET',requestURL)      //get request because we'll be getting an image.

    //we don't need to send any content with our request, but if we did we'd probably use a post request.

    //add a listener for when we get a response
    request.addEventListener('load', function(event){
        if (event.target.status !== 200){    //200 is the good coe
            alert("Error! Didn't get 200 back")
            
            

        }else{
            
            console.log("got a response")
            //this converts the request response from JSON into a javascript object
            var responseParsed = JSON.parse(request.response);
            console.log("Response parsed is: ",responseParsed);
            var message = document.createElement('h2');
            message.textContent = responseParsed.msg;

            //you could put this anywhere, I'm just adding it to the end of the item.
            document.body.appendChild(message);
        }
    })
    request.send();
}


function getDogPhoto(){
    //the request we are going to send to our server.
    var request = new XMLHttpRequest();
    var requestURL = '/giveMeADog' //this could be anything

    request.open('GET',requestURL)      //get request because we'll be getting an image.

    //we don't need to send any content with our request, but if we did we'd probably use a post request.

    //add a listener for when we get a response
    request.addEventListener('load', function(event){
        if (event.target.status !== 200){    //200 is the good coe
            alert("Error! Didn't get 200 back")
            
            

        }else{
            
            console.log("got a response")
            //this converts the request response from JSON into a javascript object
            var responseParsed = JSON.parse(request.response);
            console.log("Response parsed is: ",responseParsed);
            var message = document.createElement('h2');
            message.textContent = responseParsed.msg;

            //you could put this anywhere, I'm just adding it to the end of the item.
            document.body.appendChild(message);
        }
    })
    request.send();
}