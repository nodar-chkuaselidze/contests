'use strict';

global.program = require('./package.json');
global.ROOT    = __dirname;
global.fs      = require('fs');
global.args    = require('commander');

var debug = require('debug')('contests');

args
  .version(program.version)
  .parse(process.argv);


process.home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
console.log(process.env);
