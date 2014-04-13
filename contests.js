#!/usr/bin/env node
'use strict';

global.ROOT    = __dirname;
global.program = require('./package.json');
global.fs      = require('fs');
global.args    = require('commander');

var debug = require('debug')('contests');

args.version(program.version);
