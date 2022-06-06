const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating delete thread comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const mockThreadCommentRepository = new ThreadCommentsRepository();

    mockThreadCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve);

    // Action
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action + Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload)).resolves.not.toThrowError();
  });
});
