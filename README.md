# Automation

The goal of this project is to build a cli app to automate some tasks we are facing when we deploy in Landfiles.

When we deploy either in acceptance or production environment, we need to send to the rest of the team the list of tickets and change the status of tickets.

We are using API provided by Atlassian (JIRA) teams. This means that only projects hosted on Jira can use this application.

Other teams can use it but we assume they are using agile method 🤪

## ⚙️ How to Run App

- run `npm install`

- run `npm link .`

- Configure env variables

`JIRA_BASE_URL=XXX`

`MAILGUN_API_KEY=XXX`

`MAILGUN_DOMAIN=XXX`

## 🔐 Commands

1.  #### `itnv --help`

```
Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  configure       Configure Jira credentials
  list            List jira issues
  delivery        Make a delivery on one environment
  help [command]  display help for command
```

2.  #### `itnv configure consumer`

This command allows the user to connect this application to its Jira account.
Email address and API-Token are required. Follow this [link](https://confluence.atlassian.com/cloud/api-tokens-938839638.html) to get API-Token

3. #### `itnv list -h`

```
Options:
  -V, --version      output the version number
  -c, --code-review  list issues in CODE REVIEW column
  -d, --done         list issues in DONE column
  -h, --help         display help for command
```

4. #### `itnv delivery -h`

To deliver in prod environment we have two options : either deploy all tickets inside a release or deliver tickets in done column.

```
Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  test            Deliver in test environment
  prod [options]  Deliver in prod environment
  help [command]  display help for command
```
