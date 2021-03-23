const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const fs = require('fs');
const path = require('path');
const mjml2html = require('mjml');
const mustache = require('mustache');
const chalk = require('chalk');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

function loadHtmlTemplate(params, isVersion) {
  const mjmlTemplate = fs.readFileSync(
    path.join(__dirname, 'templates', isVersion ? 'delivery-version.mjml' : 'delivery.mjml'),
    'utf8'
  );
  const { html: htmlTemplate } = mjml2html(mjmlTemplate);

  return mustache.render(htmlTemplate, params);
}

const transporter = nodemailer.createTransport(mailgun(auth));

function sendMail(mail) {
  const data = {
    from: 'ITNV <teams@itnewvision.com>',
    to: mail.to,
    cc: mail.cc,
    subject: mail.subject,
    html: loadHtmlTemplate(
      {
        environment: mail.environment,
        tickets: mail.tickets,
        version: mail.version,
      },
      mail.isVersion
    ),
  };

  transporter.sendMail(data, error => {
    if (!error) {
      console.log(chalk.green('Mail sent 👌🏾'));
    } else {
      console.log(chalk.red('Ooops ! Error 😩', error));
    }
  });
}

module.exports = { sendMail };
