const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1900).max(2100).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().allow(null).allow(''),
  albumId: Joi.string().allow(null).allow(''),
});

module.exports = SongPayloadSchema;
