export default class Authenticator {
  constructor(id, name, key, account, timeBased) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.account = account;
    this.timeBased = timeBased;
  }
}