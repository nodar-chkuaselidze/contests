'use strict';

function CF(problem, file, cacher, confs) {
  this.problem = problem;
  this.file    = file;
  this.cacher  = cacher;
  this.confs   = confs;
}

CF.prototype.testFetch = function (done) {
};

CF.prototype.test = function (done) {
  done();
};

CF.prototype.post = function (done) {
  console.log('post');
  done();
};

module.exports = CF;
