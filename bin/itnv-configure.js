const pkg = require('../package.json');
const { program } = require('commander');
const { configure } = require('../commands/configure');

program.version(pkg.version);

program
  .command('consumer')
  .description('Add Jira account with email and API-Token')
  .action(async () => await configure());

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
