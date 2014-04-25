'use strict';

var debug = require('debug')('cache'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require('fs');

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
  this.cacheDir = root + '/' + name;
}

/**
 * Saves files with data | async
 */
Cache.prototype.save = function (file, data, done) {
  var dirname = path.dirname(file),
      basename = path.basename(file),
      fileDir = this.cacheDir + '/' + dirname,
      filePath = fileDir + '/' + basename;

  debug('Creating directory: ' + fileDir);
  mkdirp(fileDir, function (err) {
    if (err) {
      done(err);
      return;
    }

    debug('file created, writing to file: ' + filePath);
    fs.writeFile(filePath, data, function (err) {
      if (err) {
        done(err);
        return;
      }

      done();
    });
  });
};

/**
 * Reads data from cache | async
 */
Cache.prototype.read = function (file, done) {
  var dirname = path.dirname(file),
      basename = path.basename(file),
      fileDir = this.cacheDir + '/' + dirname,
      filePath = fileDir + '/' + basename;

  debug('check if file exists: ' + filePath);
  fs.exists(filePath,  function (exists) {
    if (exists) {
      debug('reading from file: ' + filePath);
      fs.readFile(filePath, { encoding : 'utf8' }, done);
      return;
    }

    done('Cache does not exist');
  });
};

/**
 * Remove cache data
 */
Cache.prototype.remove = function (file, done) {
  var dirname = path.dirname(file),
      basename = path.basename(file),
      fileDir = this.cacheDir + '/' + dirname,
      filePath = fileDir + '/' + basename;

  debug('removing file: ' + filePath);
  fs.unlink(filePath, done);
};

/**
 * Clean Cache
 */
Cache.prototype.clean = function (done) {
  var exec = require('child_process').exec,
      self = this,
      cmd  = 'rm -r "' + path.resolve(this.cacheDir) + '"';

  debug('removing directory content: ' + cmd);
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      done(error.toString());
      return;
    }

    self.createCacheDir();
    done();
  });
};

/**
 * Actually creates directory: root/name | Sync
 */
Cache.prototype.createCacheDir = function () {
  debug('Creating cache dir: ' + this.cacheDir);
  return mkdirp.sync(this.cacheDir);
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
