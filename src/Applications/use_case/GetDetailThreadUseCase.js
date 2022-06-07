class GetDetailThreadUseCase {
  constructor({
    threadRepository, threadCommentRepository,
  }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThread(threadId);
    const comments = await this._threadCommentRepository
      .getDetailCommentsByThreadId(threadId);
    const detailThread = await this._threadRepository.getDetailThreadById(threadId);

    detailThread.setComments(comments);

    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
