const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentsHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;
