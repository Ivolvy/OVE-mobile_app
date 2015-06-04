var fileArray = new Array; //faire un tableau pour stocker le chemin de toutes les images

var cameraApp = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // cameraApp.receivedEvent('deviceready');
        //console.log(navigator.camera);
    },

    takePicture: function(){
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });
        function onSuccess(imageURI) {
            // var image = document.getElementById('imgH');
            var fileURL = imageURI;
            
            fileArray.push(fileURL); //add image path in the array

            return true;
        }
        function onFail(message) {
            // alert('Failed because: ' + message);
        }
    },

    //upload a picture on the server
    uploadPicture: function(missionExplication){

        function win(i){

            if(missionExplication.savePicturesInDatabase(fileArray)){
                if(i == fileArray.length - 1){
                    fileArray.splice(0,fileArray.length); //empty the array
                }
            }
        }

        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        };

        for(var i=0;fileArray.length;i++){
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileArray[i].substr(fileArray[i].lastIndexOf('/') + 1);
            options.mimeType = "text/plain";

            var ft = new FileTransfer();
            ft.upload(fileArray[i], encodeURI("http://michaelgenty.com/upload.php"), win(i), fail, options);
        }
    }


    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
     }*/
};

