'use strict';

var debug = require('debug')('cache'),
    mkdirp = require('mkdirp');

/**
 * Constructor
 *
 * name - Directory name under root
 * root - Root cache directory, found system cache otherwise
 */
function Cache(name, root) {
  if (!root) {
    root = this.getSysCacheDir();
  }

  debug('Check cache directory: ' + root);
  this.root  = root;
  this.location = name;
}

/**
 * Actually creates directory: root/name
 */
Cache.prototype.createCacheDir = function () {
  var cacheDir = this.root + '/' + this.location;

  debug('Creating cache dir: ' + cacheDir);
  return mkdirp.sync(cacheDir);
};


/**
 * Finds system cache Dir
 */
Cache.prototype.getSysCacheDir = function () {
  var isWindows = process.platform === 'win32',
      home     = process.env[isWindows ? 'USERPROFILE' : 'HOME'];

  if (isWindows) {
    //can't test how to get %APPDATA%, yet
    throw 'Not implemented yet';
  }

  return home + '/.cache';
};


/**
 * get Root directory
 */
Cache.prototype.getRoot = function () {
  return this.root;
};


module.exports = Cache;
