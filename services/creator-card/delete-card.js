const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');
const CreatorCard = require('@app/repository/creator-card/');

const spec = `root { // Delete Creator Card Specification
  slug string<lengthBetween:5,50>
  creator_reference string<length:20>
}`;

const parsedSpec = validator.parse(spec);

async function deleteCard(serviceData) {
  let response;
  const data = validator.validate(serviceData, parsedSpec);

  try {
    const card = await CreatorCard.findOne({
      query: { slug: data.slug, creator_reference: data.creator_reference },
    });

    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    await CreatorCard.deleteOne({ query: { _id: card._id } });
    const { _id: id, __v, ...rest } = card;
    response = { id, ...rest, deleted: Date.now() };
  } catch (error) {
    appLogger.errorX(error, 'delete-card-error');
    throw error;
  }

  return response;
}

module.exports = deleteCard;
