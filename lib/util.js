const CredentialManager = require('./credential-manager');
const pkg = require('../package.json');

const mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmpty = string => (string === '' ? 'This field is required' : true);

const isEmailValid = email => (!mailRegex.test(email) ? 'Enter a valid email' : true);

const credential = new CredentialManager(`itnv-${pkg.name.split('/')[1]}`);

module.exports = { isEmpty, isEmailValid, credential };
