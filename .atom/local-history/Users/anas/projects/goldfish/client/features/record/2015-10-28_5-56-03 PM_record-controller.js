App.controller('recordCtrl', ['$scope', 'webRecorderService',
  function($scope, webRecorderService){

    $scope.isRecording = false;
    $scope.showAnalysis = false;
    $scope.isMobile = false;

    function setUniqueSession() {
      var recordSession = Random.id();
      Session.set('goldfishRecordSession', recordSession);
      return recordSession;
    }

    if(!Meteor.isCordova){webRecorderService.initAudio();}

    function toggleRecordingStatus(){
      $scope.isRecording = !$scope.isRecording;
    }

    function cordovaRecordAndUpload() {
      var pc = new cordova.plugins.iosrtc.RTCPeerConnection({
        iceServers: []
      });

      cordova.plugins.iosrtc.getUserMedia(
        // constraints
        {
          audio: true,
          video: false
        },
        // success callback
        function(stream) {
          console.log('got local MediaStream: ', stream);

          pc.addStream(stream);
        },
        // failure callback
        function(error) {
          console.error('getUserMedia failed: ', error);
        }
      );
    }
    // function cordovaRecordAndUpload(){
    //   return navigator.device.capture.captureAudio(
    //     function(media) {
    //       window.resolveLocalFileSystemURI(media[0].localURL, function(fileEntry) {
    //         fileEntry.file(function(file) {
    //           AudioStore.insert(file, function(err, fileObj) {
    //             return ('Inserted Successfully');
    //           });
    //         });
    //       }, function(err) {
    //         console.error('err', err);
    //       });
    //     },
    //     function(err) {
    //       return alert(err);
    //     }
    //   );
    // }

    $scope.uploadAudio = function(){
      var record = webRecorderService.blob;
      AudioStore.insert(record,function(err,file){
        console.log('file: ', file);
      });
    };

    $scope.record = function(){
      var recordSession = setUniqueSession();
      console.log('1  ', recordSession);
      if(Meteor.isCordova){
        $scope.isMobile = true;
          cordovaRecordAndUpload();
      }else{
          if(!$scope.isRecording){
            webRecorderService.startRecording(recordSession);
            console.log('2  ', recordSession);
            toggleRecordingStatus();
            $scope.showAnalysis = false;
          }else{
            webRecorderService.stopRecording(recordSession);
            toggleRecordingStatus();
            $scope.showAnalysis = true;
          }
      }
    };
}]);
