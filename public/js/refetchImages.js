

window.onload = checkForOldImages;

function checkForOldImages(){
    var title = window.location.pathname.split("/").pop();
    var getImagesRequest = new XMLHttpRequest();
    getImagesRequest.open("get","/checkForOldImages/"+title)
    getImagesRequest.addEventListener("load",function(event){
        if(event.target.status===200){
           
            var body = JSON.parse(event.target.response)
            var coolImages = body.images;
           
            coolImages.forEach(function(image){
                console.log(image)
                const byteCharacters = atob(image)
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                var id = generateID("exampleImage")
                var blob = new Blob([byteArray],{type:"image/png"})
                var src = URL.createObjectURL(blob);
                console.log(src)
                images[id] = src;
                addImage(id,false)
            })
        }

    })
    getImagesRequest.send()
}