'use strict';
var Q = require('q'),
    request = require('superagent');

function CF(problem, file, cacher, confs) {
  this.problem = problem;
  this.file    = file;
  this.cacher  = cacher;
  this.confs   = confs;
}

CF.prototype.testFetch = function () {
};

CF.prototype.test = function () {
};

CF.prototype.post = function () {
};

module.exports = CF;
