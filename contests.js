#!/usr/bin/env node
'use strict';

global._       = require('lodash');

_.extend(global, {
  ROOT:    __dirname,
  program: require('./package.json'),
  Cache:   require('./lib/Cache.js'),
  fs:      require('fs'),
});

global.cacher = new Cache(program.name);
cacher.createCacheDir();

var args  = require('commander'),
    debug = require('debug')('contests');


args.version(program.version);
debug('Version of ' + program.name + ' is ' + program.version);
