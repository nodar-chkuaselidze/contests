'use strict';
var fs = require('fs');

function File(filename) {
  if (!fs.existsSync(filename)) {
    throw 'Execution file not found';
  }

  this.file = filename;
}

File.prototype.test = function (stdin, stdout, done) {
};

File.getHomeDir = function () {
  var isWindows = process.platform === 'win32';
  
  return process.env[isWindows ? 'USERPROFILE' : 'HOME'];
};

module.exports = File;
