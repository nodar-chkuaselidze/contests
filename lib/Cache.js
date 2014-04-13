'use strict';

var debug = require('debug')('cache'),
    mkdirp = require('mkdirp');

function Cache(name, root) {
  if (!root) {
    root = this.getSysCacheDir();
  }

  debug('Check cache directory: ' + root);
  this.root  = root;
  this.location = name;
}


Cache.prototype.getSysCacheDir = function () {
  var isWindows = process.platform === 'win32',
      home     = process.env[isWindows ? 'USERPROFILE' : 'HOME'];

  if (isWindows) {
    //yet can't test how to get %APPDATA%
    throw 'Not implemented yet';
    return;
  }

  return home + '/.cache';
};


module.exports = Cache;
