'use strict';

var program = require('./package.json'),
    debug = require('debug')('contests.js'),
    fs    = require('fs'),
    shell = require('commander');


shell
  .version(program.version)
  .parse(process.argv);

console.log(process.env['USERPORFILE']);
console.log(process.env['HOME']);
