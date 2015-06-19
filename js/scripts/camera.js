var fileURL;

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
            fileURL = imageURI;
        /*    var newMarker = markerArray.length;
            alert("newmarker: "+newMarker)
            fileArray[newMarker] = new Array();
            fileArray[newMarker].push(fileURL); //add image path in the array*/
            missionExplication.saveNbPicsOnDatabase();
            missionExplication.getPicturePosition();
        }
        function onFail(message) {
            // alert('Failed because: ' + message);
        }
    },

    //upload a picture on the server - when we selected her
    uploadPicture: function(imageSelection, imageToSendArray){

        function win(i){
            if(imageSelection.savePicturesInDatabase(imageToSendArray)){
                if(i == imageToSendArray.length - 1){
                    imageToSendArray.splice(0,imageToSendArray.length); //empty the array
                }
                //imageSelection.goToMissionOpinion();
            }
        }

        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        };

        var length = imageToSendArray.length;
        for(var index=0;index < length;index++) {
             if(imageToSendArray[index]){
                var subLength = imageToSendArray[index].length;
                for (var i = 0; i < subLength; i++) {
                    if(imageToSendArray[index][i] != "0"){
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        var imageFile = imageToSendArray[index][i];
                        options.fileName = imageFile.substr(imageFile.lastIndexOf('/') + 1);
                        options.mimeType = "text/plain";

                        var ft = new FileTransfer();
                        ft.upload(imageToSendArray[index][i], encodeURI("http://michaelgenty.com/upload.php"), win(i), fail, options);
                   }
                }
             }
        }
        alert("pictures uploaded");//TODO - completion bar or popup status
        imageSelection.goToMissionOpinion();
    }


    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
     }*/
};

