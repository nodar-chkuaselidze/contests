'use strict';

var debug = require('debug')('cache'),
    path = require('path'),
    mkdirpNode = require('mkdirp'),
    fs = require('fs'),
    Q = require('Q'),
    execNode = require('child_process').exec,


writeFile = Q.denodeify(fs.writeFile),
readFile  = Q.denodeify(fs.readFile),
mkdirp    = Q.denodeify(mkdirpNode),
unlink    = Q.denodeify(fs.unlink),
exec      = Q.denodeify(execNode);

/**
 * Constructor
 *
 * @param name - Directory name under root
 * @param root - Root cache directory, found system cache otherwise
 */
function Cache(name, root) {
  if (!root) {
    root = this.getSysCacheDir();
  }

  debug('Cacher name: ' + name);
  debug('Check cache directory root: ' + root);
  this.root  = root;
  this.location = name;
  this.cacheDir = root + '/' + name;
}

/**
 * Saves files with data
 * @param file - to write
 * @param data - to write
 */
Cache.prototype.save = function (file, data) {
  file = this.parseFile(file);

  debug('Creating directory: ' + file.dir);
  return mkdirp(file.dir)
    .then(function () {
      debug('directory for file created');
      debug('writing to file: ' + file.path);

      return writeFile(file.path, data);
    })
    .then(function (data) {
      debug('data written to file');
      return data;
    })
    .catch(errorCb('Could not save data'));
};

/**
 * Reads data from cache
 * @param file - file to read
 */
Cache.prototype.read = function (file) {
  file = this.parseFile(file);

  debug('check if file exists: ' + file.path);
  return exists(file.path)
    .then(function () {
      debug('reading from file: ' + file.path);
      return readFile(file.path, { encoding : 'utf8' });
    })
    .then(function  (data) {
      return data;
    })
    .catch(errorCb('Could not read file'));
};

/**
 * Remove cache data
 *
 * @param file - file to remove
 */
Cache.prototype.remove = function (file) {
  file = this.parseFile(file);

  debug('removing file: ' + file.path);

  return unlink(file.path)
    .then(function () {
      debug('trying to delete dir: ' + file.dir);
      removeEmptyDir(file.dir);
    }).catch(errorCb('Could not remove file'));
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
  return mkdirpNode.sync(this.cacheDir);
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
 * Get actual cache dir
 */
Cache.prototype.getCacheDir = function () {
  return this.cacheDir;
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

/**
 * Silent async method to remove empty dir
 */
function removeEmptyDir(dir) {
  try {
    fs.rmdir(dir);
  } catch(e) {
  }
}

function exists(path) {
  var deferred = Q.defer();

  fs.exists(path, function (exists) {
    if (exists) {
      debug('File "' + path + '" exists');
      deferred.resolve();
    } else {
      debug('File "' + path + '" does not exist');
      deferred.reject(new Error('Path does not exist'));
    }
  });

  return deferred.promise;
}

function errorCb(message) {
  return function (e) {
    debug('Error:');
    debug(e);
    throw new Error(message);
  };
}

//EXPORT
module.exports = Cache;
