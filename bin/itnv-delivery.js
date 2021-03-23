const pkg = require('../package.json');
const { program } = require('commander');
const { delivery } = require('../commands/delivery');

program.version(pkg.version);

program
  .command('test')
  .description('Deliver in test environment')
  .action(async () => await delivery('CODE REVIEW'));

program
  .command('prod')
  .description('Deliver in prod environment')
  .option('-r, --release', 'Deliver all tickets in one release')
  .action(async options => await delivery('DONE', options.release));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
