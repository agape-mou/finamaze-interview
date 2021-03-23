const { getListIssues } = require('./list');
const { sendMail } = require('../lib/mail-configure');
const inquirer = require('inquirer');
const Services = require('../lib/service');

const delivery = async (status, isRelease) => {
  let mailConfiguration = null;

  const config = await Services.getProjectConfig();

  if (status === 'CODE REVIEW') {
    try {
      const { sprint, issues } = await getListIssues(status);

      let { selectedIssues } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedIssues',
          message: 'Which tickets do you want to deliver?',
          choices: issues.map(issue => issue.key),
        },
      ]);

      const selected = issues.filter(issue => selectedIssues.includes(issue.key));

      mailConfiguration = {
        to: config.teams.filter(team => team.status === 'FUNCTIONAL').map(team => team.email),
        cc: config.teams.filter(team => team.status === 'TECHNICAL').map(team => team.email),
        subject: `Livraison ${config.environment.test} : ${sprint}`,
        environment: config.environment.test,
        tickets: selected,
        isVersion: false,
      };
    } catch (error) {
      // do nothing
    }
  }

  if (status === 'DONE') {
    try {
      if (!isRelease) {
        const { issues } = await getListIssues(status);

        mailConfiguration = {
          to: config.teams.filter(team => team.status === 'FUNCTIONAL').map(team => team.email),
          cc: config.teams.filter(team => team.status === 'TECHNICAL').map(team => team.email),
          subject: `Livraison ${config.environment.prod} 🧨`,
          environment: config.environment.prod,
          tickets: issues,
          isVersion: false,
        };
      } else {
        const { data } = await Services.getReleases();
        const releases = data.values;
        let { release } = await inquirer.prompt([
          {
            type: 'rawlist',
            name: 'release',
            message: 'Which version do you want to deliver?',
            choices: releases.map(r => r.name),
          },
        ]);

        mailConfiguration = {
          to: config.teams.filter(team => team.status === 'FUNCTIONAL').map(team => team.email),
          cc: config.teams.filter(team => team.status === 'TECHNICAL').map(team => team.email),
          subject: `Livraison ${config.environment.prod} 🧨 : ${release}`,
          environment: config.environment.prod,
          version: release,
          isVersion: true,
        };
      }
    } catch (error) {
      // do nothing
    }
  }

  sendMail(mailConfiguration);
};

module.exports = { delivery };
