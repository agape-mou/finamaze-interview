const chalk = require('chalk');
const { getSprintsByBoard, getAllIssues } = require('../lib/service');
const { credential } = require('../lib/util');
const ora = require('ora');

async function getListIssues(status) {
  const spinner = ora('Loading issues from Jira...').start();
  try {
    // we need the active sprint first.
    let activeSprint = null;
    const { boardId } = credential.getUserInfo();

    let [lastPage, start, index] = [false, 0, 1];

    do {
      const { data } = await getSprintsByBoard(boardId, start);

      const item = data.values.find(sprint => sprint.state === 'active');

      if (item) {
        activeSprint = item;
        break;
      }

      const { isLast, maxResults } = data;
      [lastPage, start] = [isLast, index * maxResults];
      index += 1;
    } while (!lastPage);

    if (!activeSprint) {
      console.log(chalk('An unexcepted error occurs. Try later.'));
    }

    const results = await getIssuesByBoardIdAndSprintId(boardId, activeSprint.id, status, activeSprint.name);

    spinner.stop();

    return results;
  } catch (error) {
    spinner.fail(chalk.red('Fail to load issues from Jira. Try later.'));
  }
}

async function getIssuesByBoardIdAndSprintId(boardId, sprintId, status, sprintName) {
  try {
    let issues = [];
    let [lastPage, start, index] = [false, 0, 1];

    do {
      const { data } = await getAllIssues(boardId, sprintId, start);

      const items = data.issues
        .filter(issue => issue.fields.status.name.toUpperCase() === status)
        .map(issue => ({
          key: issue.key,
          id: issue.id,
          summary: issue.fields.summary,
        }));

      issues = [...issues, ...items];

      const { total, maxResults } = data;
      [lastPage, start] = [total <= maxResults, index * maxResults];
      index += 1;
    } while (!lastPage);

    return { sprint: sprintName, issues };
  } catch (error) {
    throw new Error('');
  }
}

module.exports = { getListIssues };
