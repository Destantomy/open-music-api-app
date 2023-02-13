const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema, SongPutPayloadSchema } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutSongPayload: (payload) => {
    const validationResult = SongPutPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
