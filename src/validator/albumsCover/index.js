const InvariantError = require('../../exceptions/InvariantError');
const AlbumCoverPayloadSchema = require('./schema');

const AlbumCoverValidator = {
  validateAlbumCoverPayload: (payload) => {
    const validationResult = AlbumCoverPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumCoverValidator;
