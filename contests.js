#!/usr/bin/env node
'use strict';

global._       = require('lodash');

_.extend(global, {
  ROOT:    __dirname,
  program: require('./package.json'),
  Cache:   require('./lib/Cache.js'),
  fs:      require('fs'),
});

var args  = require('commander'),
    debug = require('debug')('contests');

new Cache('tmp');
args.version(program.version);
debug('Version of ' + program.name + ' is ' + program.version);
