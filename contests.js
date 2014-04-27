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
    debug = require('debug')('contests'),
    Engines = require('./lib/Engines'),
    engines = new Engines('./engines');


args.version(program.version);
args.command('list')
    .description('List of contests')
    .action(function (cmd, options) {
      var padd = '  ';
      padd += padd;

      console.log('  Engines List:');
      engines.getList().forEach(function (engine) {
        console.log(padd + engine);
      });
    });

args.parse(process.argv);

debug('Version of ' + program.name + ' is ' + program.version);
