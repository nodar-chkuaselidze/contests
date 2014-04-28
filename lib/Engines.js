'use strict';
/**
 * each Engine should implement methods:
 *  test - to try out as much test as engine can get
 *  post - post it to website or API
 *
 *  If error occurs, should return error in callback (errorString only)
 */

var fs = require('fs'),
    path = require('path'),
    _  = require('lodash');

function Engines(dir) {
  this.dir  = path.resolve(dir);
  this.list = this.getEngines();
}

Engines.prototype.getEngines = function () {
  if (fs.existsSync(this.dir)) {
    return fs.readdirSync(this.dir)
      .filter(function (dir) {
        return dir.substr(-3) === '.js';
      }).map(function (dir) {
        return dir.replace(/^(.*)\.js$/i, '$1');
      });
  }
};

Engines.prototype.getEngine = function (engineName, Cacher) {
  if (!Cacher || !Cacher instanceof global.Cache) {
    throw 'Cacher not found';
  }

  if (this.list.indexOf(engineName) < 0) {
    throw 'Engine not found';
  }

  var enginePath = path.resolve(this.dir + '/' + engineName),
      Engine = require(enginePath),
      error = 'Engine is not valid',
      engine;

  if (typeof Engine !== 'function') {
    throw error;
  }

  engine = new Engine(Cacher);
  if (typeof engine.test !== 'function' || typeof engine.post !== 'function') {
    throw error;
  }

  return engine;
};

Engines.prototype.getList = function () {
  return _.clone(this.list);
};

module.exports = Engines;
