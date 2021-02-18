import { Provider } from 'oidc-provider';
import Account from '../support/account';
import configuration from '../support/configuration';

configuration.findAccount = Account.findAccount;
console.log('>>>configuration', configuration);
let adapter;
(async () => {
  if (process.env.MONGODB_URI) {
    adapter = require('../adapters/mongodb').default; // eslint-disable-line global-require
    await adapter.connect();
  }
})();
const { PORT, ISSUER = `http://127.0.0.1:${PORT}` } = process.env;
const provider = new Provider(ISSUER, {
  adapter,
  ...configuration,
});
export default provider;
