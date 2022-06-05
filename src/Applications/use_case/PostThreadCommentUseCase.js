const PostThreadComment = require('../../Domains/threadComments/enttities/PostThreadComment');

class PostThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const { userId, content, threadId } = useCasePayload;

    await this._threadRepository.verifyThread(threadId);
    const postedThreadComment = await this._threadCommentRepository
      .addComment(new PostThreadComment({
        userId, content, threadId,
      }));

    return postedThreadComment;
  }
}

module.exports = PostThreadCommentUseCase;
