const { createHandler } = require('@app-core/server');
const deleteCard = require('@app/services/creator-card/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],

  async handler(rc, helpers) {
    const payload = {
      ...rc.params,
      ...rc.body,
    };

    const response = await deleteCard(payload);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Deleted Successfully.',
      data: response,
    };
  },
});
