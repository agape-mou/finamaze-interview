const Configstore = require('configstore');
const keytar = require('keytar');

class CredentialManager {
  constructor(name) {
    this.configstore = new Configstore(name);
    this.service = name;
  }

  get() {
    const email = this.configstore.get('email');

    if (email) {
      const token = keytar.getPassword(this.service, email);
      return [email, token];
    }

    throw new Error('Impossible to get back your credentials');
  }

  async set(email, token, user) {
    this.configstore.set('email', email);
    this.configstore.set('user', user);
    this.configstore.set('authorization', Buffer.from(email + ':' + token).toString('base64'));

    await keytar.setPassword(this.service, email, token);
  }

  getAuthorization() {
    const authorization = this.configstore.get('authorization');

    return authorization ? authorization : '';
  }

  getUserInfo() {
    return this.configstore.get('user');
  }
}

module.exports = CredentialManager;
