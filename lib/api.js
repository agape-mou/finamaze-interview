const axios = require('axios');
const { credential } = require('./util');

const instance = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// When we configure the consumer we will have a set api call to make. And we don't need to intercept this request
const EXCLUDE_ENDPOINT = ['/rest/api/2/myself', '/rest/api/2/project/search', '/rest/agile/1.0/board'];

instance.interceptors.request.use(config => {
  if (config && config.url && !EXCLUDE_ENDPOINT.some(endpoint => endpoint === config.url)) {
    config.headers.Authorization = `Basic ${credential.getAuthorization()}`;
  }

  return config;
}, Promise.reject);

module.exports = instance;
