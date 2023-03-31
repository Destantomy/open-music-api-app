const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  coverurl: Joi.string(),
});

module.exports = AlbumPayloadSchema;
