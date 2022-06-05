const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostThreadComment = require('../../../Domains/threadComments/enttities/PostThreadComment');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentsRepository');
const PostThreadCommentUseCase = require('../PostThreadCommentUseCase');

describe('PostThreadCommentUseCase', () => {
  it('should ochestrating post thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'ieu content teh',
    };

    const expectedPostedThreadComment = {
      id: 'comment-123',
      content: 'ieu content teh',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentsRepository();

    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addComment = jest.fn().mockImplementation(
      () => Promise.resolve(expectedPostedThreadComment),
    );

    const postThreadCommentUseCase = new PostThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const postedThreadComment = await postThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postedThreadComment).toStrictEqual(expectedPostedThreadComment);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadCommentRepository.addComment)
      .toBeCalledWith(new PostThreadComment({
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
      }));
  });
});
