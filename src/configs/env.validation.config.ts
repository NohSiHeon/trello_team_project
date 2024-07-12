import Joi from 'joi';
// Joi를 통한 유효성 검증
export const ConfigModuleValidationSchema = Joi.object({
  SERVER_PORT: Joi.number().required().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().required().default(true),
});
