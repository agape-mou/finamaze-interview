const pkg = require('../package.json');
const chalk = require('chalk');
const { program } = require('commander');
const { getListIssues } = require('../commands/list');

program.version(pkg.version);

program
  .option('-c, --code-review', 'list issues in CODE REVIEW column')
  .option('-d, --done', 'list issues in DONE column');

program.parse(process.argv);

const wrapper = async status => {
  try {
    const { issues } = await getListIssues(status);

    for (let issue of issues) {
      console.log(`> ${chalk.green(issue.key)}\t|\t${chalk.white(issue.summary)}`);
    }
    console.log('');
  } catch (error) {
    // do nothing !
  }
};

if (program.codeReview) {
  const status = 'CODE REVIEW';
  wrapper(status);
}
if (program.done) {
  const status = 'DONE';
  wrapper(status);
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
