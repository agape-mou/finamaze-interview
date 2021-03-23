#! /usr/bin/env node
const pkg = require('../package.json');
const { program } = require('commander');
const updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify({ isGlobal: true });

program
  .version(pkg.version)
  .command('configure', 'Configure Jira credentials')
  .command('list', 'List jira issues')
  .command('delivery', 'Make a delivery on an environment')
  .parse(process.argv);
