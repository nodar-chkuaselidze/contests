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
  file = this.parseFile(file);
  done = this.cb(done);

  debug('Creating directory: ' + file.dir);
  mkdirp(file.dir, function (err) {
    if (err) {
      done(err);
      return;
    }

    debug('file created, writing to file: ' + file.path);
    fs.writeFile(file.path, data, function (err) {
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
  file = this.parseFile(file);
  done = this.cb(done);

  debug('check if file exists: ' + file.path);
  fs.exists(file.path,  function (exists) {
    if (exists) {
      debug('reading from file: ' + file.path);
      fs.readFile(file.path, { encoding : 'utf8' }, done);
      return;
    }

    done('Cache does not exist');
  });
};

/**
 * Remove cache data | async
 */
Cache.prototype.remove = function (file, done) {
  file = this.parseFile(file);
  done = this.cb(done);

  debug('removing file: ' + file.path);
  fs.unlink(file.path, done);
};

/**
 * Clean Cache | async
 */
Cache.prototype.clean = function (done) {
  var exec = require('child_process').exec,
      self = this,
      cmd  = 'rm -r "' + path.resolve(this.cacheDir) + '"';

  done = this.cb(done);

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

/**
 * Helper method
 */
Cache.prototype.parseFile = function (file) {
  var dirname  = path.dirname(file),
      basename = path.basename(file),
      fileDir  = this.cacheDir + '/' + dirname,
      filePath = fileDir + '/' + basename;

  return { dir : fileDir, path : filePath };
};

var anonym = function () {};
Cache.prototype.cb = function (cb) {
  if (!cb || typeof cb !== 'function') {
    return anonym;
  }
  return cb;
};

//EXPORT
module.exports = Cache;
