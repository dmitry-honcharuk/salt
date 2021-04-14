/* eslint-disable @typescript-eslint/no-var-requires,no-undef*/

require('dotenv').config();
const Joi = require('joi');

const { error } = Joi.object({
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  NEXT_PUBLIC_SOCKET_URL: Joi.string().required(),
  NEXT_PUBLIC_AUTH_CLIENT_ID: Joi.string().required(),
}).validate(process.env, { allowUnknown: true });

if (error) {
  throw error.message;
}
