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

module.exports = File;
