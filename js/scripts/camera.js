var fileArray = new Array; //store the path to all taken images

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

    takePicture: function(missionExplication){
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });
        function onSuccess(imageURI) {
            // var image = document.getElementById('imgH');
            var fileURL = imageURI;
            fileArray.push(fileURL); //add image path in the array
            missionExplication.getPicturePosition();
        }
        function onFail(message) {
            // alert('Failed because: ' + message);
        }
    },

    //upload a picture on the server
    uploadPicture: function(imageSelection, imageToSendArray){

        function win(i){
            if(imageSelection.savePicturesInDatabase(imageToSendArray)){
                if(i == imageToSendArray.length - 1){
                    imageToSendArray.splice(0,imageToSendArray.length); //empty the array
                    imageSelection.goToMissionOpinion();
                }
            }
        }

        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        };

        for(var i=0;imageToSendArray.length;i++){
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageToSendArray[i].substr(imageToSendArray[i].lastIndexOf('/') + 1);
            options.mimeType = "text/plain";

            var ft = new FileTransfer();
            ft.upload(imageToSendArray[i], encodeURI("http://michaelgenty.com/upload.php"), win(i), fail, options);
        }
        alert("pictures uploaded");//TODO - completion bar or popup status
        
    }


    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
     }*/
};

