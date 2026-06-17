const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');
const CreatorCard = require('@app/repository/creator-card/');
const { randomBytes } = require('@app-core/randomness');

const spec = `root { // Creator Card Specification
  title string<lengthBetween:3,100>
  description? string<maxLength:500>
  slug? string<lengthBetween:5,50|isUnique|indexed>
  creator_reference string<length:20>
  links[]? {
    title string<lengthBetween:1,100>
    url string<maxLength:200|startsWith:http://|startsWith:https://>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<lengthBetween:3,100>
      description string<maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function createCard(serviceData) {
  let response;
  const data = validator.validate(serviceData, parsedSpec);

  if (data.slug) {
    const existingCard = await CreatorCard.findOne({
      query: { slug: data.slug },
    });

    if (existingCard) {
      throwAppError(CreatorCardMessages.SLUG_TAKEN, ERROR_CODE.SL02);
    }
  } else {
    const baseSlug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');

    let generatedSlug = baseSlug;

    const appendRandomSuffix = (slug) => `${slug}-${randomBytes(6)}`;

    if (generatedSlug.length < 5) {
      generatedSlug = appendRandomSuffix(generatedSlug);
    }

    while (
      // eslint-disable-next-line no-await-in-loop
      await CreatorCard.findOne({
        query: { slug: generatedSlug },
      })
    ) {
      generatedSlug = appendRandomSuffix(baseSlug);
    }

    data.slug = generatedSlug;
  }

  if (!data.access_type) {
    data.access_type = 'public';
  }

  if (data.access_type === 'public' && data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_NOT_ALLOWED, ERROR_CODE.AC05);
  }

  if (data.access_type === 'private' && !data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, ERROR_CODE.AC01);
  }

  try {
    const card = await CreatorCard.create(data);
    const { _id: id, __v, ...rest } = card;
    response = { id, ...rest };
  } catch (error) {
    appLogger.errorX(error, 'create-card-error');
    throw error;
  }

  return response;
}

module.exports = createCard;
