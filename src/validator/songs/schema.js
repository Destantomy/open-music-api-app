const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().allow(null).allow(''),
  albumId: Joi.string().allow(null).allow(''),
});

module.exports = SongPayloadSchema;
