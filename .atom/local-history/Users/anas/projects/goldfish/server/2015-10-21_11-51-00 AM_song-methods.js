
var currentStream;
var request = Meteor.npmRequire('request');

Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },
  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },

  startStream: function() {
    currentStream = Npm.require('fs').createWriteStream('/tmp/test-file.txt');
  },

  stream: function(data) {
    currentStream.write(data);
  },

  endStream: function() {
    currentStream.end();
  }
});

Meteor.publish('startStream', function(stream) {

});

Meteor.publish('stream', function(stream) {
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', {
    data:  stream
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
    }
  });
});

Meteor.publish('stopStream', function() {
  console.log('finishedStream');
});
