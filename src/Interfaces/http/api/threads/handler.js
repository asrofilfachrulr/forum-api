const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');
const PostThreadUseCase = require('../../../../Applications/use_case/PostThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadById = this.getThreadById.bind(this);
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

  async getThreadById({ params }) {
    const getDetailThreadUseCase = await this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getDetailThreadUseCase.execute(params.threadId);

    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = ThreadsHandler;
