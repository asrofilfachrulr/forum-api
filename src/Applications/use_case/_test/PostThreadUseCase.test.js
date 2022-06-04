const PostedThread = require('../../../Domains/thread/entities/PostedThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const PostThreadUseCase = require('../PostThreadUseCase');
const PostThread = require('../../../Domains/thread/entities/PostThread');

describe('PostThreadUseCase', () => {
  it('should orchestrating the post thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'user-123',
      title: 'title',
      body: 'body body',
    };

    const expectedPostedThread = new PostedThread({
      id: 'thread-iddummyeuy',
      title: 'title',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedPostedThread));

    const postThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await postThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(expectedPostedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new PostThread({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
