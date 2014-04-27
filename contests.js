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
    engines = new Engines('./engines'),
    enginesList = engines.getList();


args.version(program.version);
args.command('list')
    .description('List of contests')
    .action(function (cmd, options) {
      var padd = '  ';
      padd += padd;

      console.log('  Engines List:');
      enginesList.forEach(function (engine) {
        console.log(padd + engine);
      });
    });

args.command('test <engine> <id>')
    .description('run tests for problemId for <engine>')
    .action(function (engine, problem) {
      console.log(engine, problem);
    });

args.command('help').action(function () {
  args.help();
});

args.parse(process.argv);

debug('Version of ' + program.name + ' is ' + program.version);
