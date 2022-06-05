const PostThreadCommentsUseCase = require('../../../../Applications/use_case/PostThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentsHandler = this.postThreadCommentsHandler.bind(this);
  }

  async postThreadCommentsHandler({ auth, payload, params }, h) {
    const postThreadCommentsUseCase = this._container.getInstance(PostThreadCommentsUseCase.name);
    const useCasePayload = {
      userId: auth.credentials.id,
      content: payload.content,
      threadId: params.threadId,
    };
    const addedComment = await postThreadCommentsUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadCommentsHandler;
