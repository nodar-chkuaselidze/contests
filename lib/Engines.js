'use strict';

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

Engines.prototype.getList = function () {
  return _.clone(this.list);
};

module.exports = Engines;
