const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const PostThreadCommentUseCase = require('../../../../Applications/use_case/PostThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentsHandler = this.postThreadCommentsHandler.bind(this);
    this.deleteThreadCommentsHandler = this.deleteThreadCommentsHandler.bind(this);
  }

  async postThreadCommentsHandler({ auth, payload, params }, h) {
    const postThreadCommentUseCase = this._container.getInstance(PostThreadCommentUseCase.name);
    const useCasePayload = {
      userId: auth.credentials.id,
      content: payload.content,
      threadId: params.threadId,
    };
    const addedComment = await postThreadCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentsHandler({ auth, params }) {
    const deleteThreadCommentsUseCase = this._container
      .getInstance(DeleteThreadCommentUseCase.name);

    const useCasePayload = {
      userId: auth.credentials.id,
      commentId: params.commentId,
    };

    await deleteThreadCommentsUseCase.execute(useCasePayload);

    return { status: 'success' };
  }
}

module.exports = ThreadCommentsHandler;
