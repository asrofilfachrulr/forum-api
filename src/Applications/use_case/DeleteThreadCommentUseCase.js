class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const { userId, commentId } = useCasePayload;
    await this._threadCommentRepository.verifyComment(commentId);
    await this._threadCommentRepository.verifyCommentOwner(userId, commentId);
    await this._threadCommentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
