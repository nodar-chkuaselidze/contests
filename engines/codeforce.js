'use strict';

function CF(problem, file, cacher) {
  this.problem = problem;
  this.file    = file;
  this.cacher  = cacher;
}

CF.prototype.test = function (done) {
  console.log('test?');
  done();
};

CF.prototype.post = function (done) {
  console.log('post');
  done();
};

module.exports = CF;
