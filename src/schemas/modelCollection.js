import { model } from 'mongoose';
import account from './account';

const AccountModel = model('account', account);

export default {
  AccountModel,
};
