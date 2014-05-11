'use strict';
var Q = require('q'),
    request = require('superagent');

function CF(problem, file, cacher, confs) {
  this.problem = problem;
  this.file    = file;
  this.cacher  = cacher;
  this.confs   = confs;
  this.fetchTry= false;
}

CF.prototype.testFetch = function () {
  this.fetchTry = true;
  return Q.reject('Fetch is not implemented');
};

CF.prototype.test = function (i) {
  var self = this,
      i    = typeof i === "undefined" ? 0 : i,
      testFile;

  testFile = self.problem + '/test' + i;

  return self.cacher.exists(testFile)
    .then(function () {
      console.log(123);
    })
    .catch(function () {
      if (self.fetchTry) {
        throw 'Something went wrong while fetching..';
      }

      return self.testFetch()
                 .then(function () {
                   return self.test();
                 })
                 .catch(function (e) { throw e; })
    });
};

CF.prototype.post = function () {
};

module.exports = CF;
