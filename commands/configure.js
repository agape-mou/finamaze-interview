const inquirer = require('inquirer');
const utils = require('../lib/util');
const Services = require('../lib/service');
const chalk = require('chalk');
const ora = require('ora');

const { credential } = utils;

let iterator;

// It's more convenient to use a generator because we have a sequence of task to handle
function* configureConsumerActions() {
  try {
    const user = yield getUser();
    const { email, token } = user;
    const project = yield configureDefaultProject(email, token);
    const boardId = yield configureDefaultBoard(email, token, project.id);
    yield saveDefaultConfigurations(user, project, boardId);
  } catch (error) {
    console.log(chalk.red(error));
  }
}

const getUser = async () => {
  let { email, token } = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'What is your Jira email ?', validate: utils.isEmailValid },
    { type: 'password', name: 'token', message: 'What is your Jira API-Token ?', validate: utils.isEmpty },
  ]);

  try {
    const { data: user } = await Services.getCurrentUser(email, token);

    iterator.next({ ...user, email, token });
  } catch (error) {
    iterator.throw('Unable to connect with Jira. Check your email and API-token and try again.');
  }
};

const configureDefaultProject = async (email, token) => {
  const spinner = ora('Loading projects from Jira...').start();
  try {
    const { data } = await Services.getAllProject(email, token);

    spinner.stop();

    const projects = data.values;

    let { projectName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectName',
        message: 'What project are you working on?',
        choices: projects.map(pr => pr.name),
      },
    ]);

    const project = projects.find(pr => pr.name === projectName);

    iterator.next(project);
  } catch (error) {
    spinner.fail(chalk.red('Fail to load projects'));

    iterator.throw('An unexpected error occurs when configuring the default project. Try later.');
  }
};

const configureDefaultBoard = async (email, token, projectId) => {
  try {
    const { data: boards } = await Services.getAllBoard(email, token);

    const board = boards.values
      .filter(b => b.type === 'scrum' && b.location.projectId.toString() === projectId)
      .shift();

    iterator.next(board.id);
  } catch (error) {
    iterator.throw('An unexpected error occurs. Try later.');
  }
};

const saveDefaultConfigurations = async (user, project, boardId) => {
  const data = Services.getTeam(project.key);
  const config = {
    accountId: user.accountId,
    name: user.name,
    projectId: project.id,
    projectKey: project.key,
    projetName: project.name,
    boardId: boardId,
    projectConfig: data,
  };

  await credential.set(user.email, user.token, config);

  console.log(chalk.green('\nAccount succesfully configured. Bravo !!!'));
};

const configure = () => {
  iterator = configureConsumerActions();

  iterator.next();
};

module.exports = { configure };
