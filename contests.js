#!/usr/bin/env node
'use strict';

global._       = require('lodash');

_.extend(global, {
  ROOT:    __dirname,
  CWD:     process.cwd(),
  program: require('./package.json'),
  Cache:   require('./lib/Cache.js'),
  fs:      require('fs'),
});

global.cacher = new Cache(program.name);
cacher.createCacheDir();

var args  = require('commander'),
    debug = require('debug')('contests'),
    Engines = require('./lib/Engines'),
    engines = new Engines(ROOT + '/engines'),
    enginesList = engines.getList(),
    padd = '  ', paddx2 = padd + padd;

function testOrPost (cmd, engine) {
  var cmdArgs = Array.prototype.slice.call(arguments, 2);
  try {
    var engineCache = new Cache(engine, cacher.getCacheDir());
    engineCache.createCacheDir();

    engine = engines.getEngine(engine, engineCache);

    engine[cmd].apply(engine, cmdArgs);
  } catch (e) {
    console.log(e);
  }
}

args.version(program.version);
args.command('list')
    .description('List of contests')
    .action(function (cmd, options) {
      console.log('  Engines List:');
      enginesList.forEach(function (engine) {
        console.log(paddx2 + engine);
      });
    });

args.command('test <engine> <id> <file>')
    .description('run tests for problem for <engine>')
    .action(function (engine, problem, file) {
      testOrPost('test', engine, problem, file, function (error) {
        console.log('tested');
      });
    });

args.command('post <engine> <id> <file>')
    .description('post test to <engine>')
    .action(function (engine, problem, file) {
      testOrPost('post', engine, problem, file, function (error) {
        console.log('posted');
      });
    });

args.command('help').action(function () {
  args.help();
});

args.parse(process.argv);

var commandCalled = args.args.some(function (elem) {
  return elem instanceof args.Command;
});

if (!commandCalled) {
  args.help();
}

debug('Version of ' + program.name + ' is ' + program.version);
