import mongoose from 'mongoose';

const { Schema } = mongoose;
const account = new Schema({
  subject: { type: String, unique: true, required: true },
  preferred_username: { type: String, unique: true, required: true },
  picture: String, // optional
  name: String, // optional
  family_name: String, // optional
  given_name: String, // optional
  middle_name: String, // optional
  nickname: String, // optional
  gender: String, // optional
  birthdate: String, // optional
  zoneinfo: String, // optional
  locale: String, // optional
  updated_at: Date,
  // email scope
  email: { type: String },
  email_verified: { type: Boolean },
  // address scope
  address: String, // optional
  // phone  scope
  phone_number: { type: String },
  phone_number_verified: { type: Boolean, required: true, default: true },
  // nt scope
  // system use
  secret: { type: String, required: true },
  created_at: Date,
  enabled: { type: Boolean, required: true, default: true },
}, {
  collection: 'accounts',
});

module.exports = account;
