const Joi = require('joi');

const AlbumCoverPayloadSchema = Joi.object({
  coverUrl: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg').required(),
});

module.exports = AlbumCoverPayloadSchema;
