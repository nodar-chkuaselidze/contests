'use strict';
/**
 * each Engine should implement methods:
 *  test - to try out as much test as engine can get
 *  post - post it to website or API
 *
 *  If error occurs, should return error in callback (errorString only)
 */

var fs = require('fs'),
    _  = require('lodash');

function Engines(dir) {
  this.dir  = dir;
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

Engines.prototype.getEngine = function (engineName) {
  if (this.list.indexOf(engineName) < 0) {
    throw 'Engine not found';
  }

  var Engine = require(this.dir + '/' + engineName);
  return new Engine();
};

Engines.prototype.getList = function () {
  return _.clone(this.list);
};

module.exports = Engines;
