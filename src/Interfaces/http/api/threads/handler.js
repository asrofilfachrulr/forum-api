const PostThreadUseCase = require('../../../../Applications/use_case/PostThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler({ auth, payload }, h) {
    const postThreadUseCase = this._container.getInstance(PostThreadUseCase.name);
    const useCasePayload = {
      id: auth.credentials.id,
      title: payload.title,
      body: payload.body,
    };
    const addedThread = await postThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
