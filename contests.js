#!/usr/bin/env node
'use strict';

global._       = require('lodash');

_.extend(global, {
  ROOT:    __dirname,
  CWD:     process.cwd(),
  program: require('./package.json'),
  Cache:   require('./lib/Cache'),
  File:    require('./lib/File'),
  fs:      require('fs'),
  Q:       require('q'),
  request: require('superagent'),
  nconf:   require('nconf')
});

global.cacher = new Cache(program.name);
cacher.createCacheDir();

var args  = require('commander'),
    debug = require('debug')('contests'),
    Engines = require('./lib/Engines'),
    engines = new Engines(ROOT + '/engines'),
    enginesList = engines.getList(),
    padd = '  ', paddx2 = padd + padd,
    nconfFile = File.getHomeDir() + '/.contests.json';

debug('Loading configurations from: ' + nconfFile);
nconf.file({ file : nconfFile });

function testOrPost (cmd, engine, problem, file) {
  var Engine = engines.getEngine(engine),
      engineCache;

  engineCache = new Cache(engine, cacher.getCacheDir());
  engineCache.createCacheDir();

  engine = new Engine(problem, new File(file), engineCache, nconf.get(engine));

  var results = engine[cmd]();

  if (!Q.isPromise(results)) {
    return Q.reject('Engine API should return Promise');
  }

  return engine[cmd]();
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
      testOrPost('test', engine, problem, file).then(function () {
          console.log('tested');
        }).catch(errorCmd);
    });

args.command('post <engine> <id> <file>')
    .description('post test to <engine>')
    .action(function (engine, problem, file) {
      testOrPost('post', engine, problem, file).then(function () {
        console.log('posted');
      }).catch(errorCmd);
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

function errorCmd(error) {
  console.log(error);
}

debug('Version of ' + program.name + ' is ' + program.version);
