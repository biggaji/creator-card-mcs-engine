const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');
const CreatorCard = require('@app/repository/creator-card/');

const spec = `root { // Get Creator Card Specification
  slug string<lengthBetween:5,50>
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function getCard(serviceData, options = {}) {
  let response;
  const data = validator.validate(serviceData, parsedSpec);

  try {
    const card = await CreatorCard.findOne({
      query: { slug: data.slug },
    });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    if (card.status === 'draft') {
      throwAppError(CreatorCardMessages.CARD_NOT_PUBLISHED, ERROR_CODE.NF02);
    }

    if (card.access_type === 'private') {
      if (!data.access_code) {
        throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED_TO_VIEW, ERROR_CODE.AC03);
      }

      if (data.access_code !== card.access_code) {
        throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE, ERROR_CODE.AC04);
      }
    }
    const { _id: id, __v, access_code: _, ...rest } = card;
    response = { id, ...rest };
  } catch (error) {
    appLogger.errorX(error, 'get-card-error');
    throw error;
  }

  return response;
}

module.exports = getCard;
