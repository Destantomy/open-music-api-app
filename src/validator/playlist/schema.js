const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string(),
  username: Joi.string(),
});

module.exports = PlaylistPayloadSchema;
