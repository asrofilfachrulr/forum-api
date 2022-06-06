const ThreadCommentsRepository = require('../ThreadCommentRepository');

describe('ThreadCommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentsRepository = new ThreadCommentsRepository();

    // Action && Assert
    await expect(threadCommentsRepository.addComment()).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentsRepository.deleteComment()).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentsRepository.verifyComment()).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentsRepository.verifyCommentOwner()).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
