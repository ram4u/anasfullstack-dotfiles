var global  = pRequire('/global');
var apiApp  = global.apiApp;
var idgen   = pRequire('/lib/idgen');
var spawn   = require('child_process').spawn;
var util    = pRequire('/lib/util');
var fs      = require('fs');
var path    = require('path');

function soxWrapper(stream, args) {
  var sox = spawn('sox', args);

  stream.pipe(sox.stdin);
  return { promise: util.promisifyProcess(sox), stream: sox.stdout };
}

function pcmToOgg(stream) {
  var args = [
    '-r', '44100', '-e', 'signed', '-b', '16', '-c', '1', '-t', 's16', '-',
    '-C', '3.0', '-r', '44100', '-t', 'ogg', '-'
  ];
  return soxWrapper(stream, args);
}

// apiApp.post('/test-goldfish', function(req, res) {
//   idgen.generateId().then(function(id) {
//     var chunkName = id;
//     var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
//     var writeStream = fs.createWriteStream(jsonFileDir);
//
//     var convert = pcmToOgg(req);
//
//     convert.stream.pipe(writeStream);
//
//     convert.promise.then(function() {
//       res.send('Write Stream End');
//     });
//   });
// });

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {
    var SoxCommand = require('sox-audio');
    var command = new SoxCommand();
    var chunkName = id;
    var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream = fs.createWriteStream(jsonFileDir);

    command.input(req)
      .inputSampleRate(44100)
      .inputEncoding('signed')
      .inputBits(16)
      .inputChannels(1)
      .inputFileType('raw');

    command.output(writeStream)
      .outputSampleRate(44100)
      .outputEncoding('signed')
      .outputBits(16)
      .outputChannels(1)
      .outputFileType('ogg');
  });
});
