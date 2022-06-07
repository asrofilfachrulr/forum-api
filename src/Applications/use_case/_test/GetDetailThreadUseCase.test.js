const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentsRepository = require('../../../Domains/threadComments/ThreadCommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const DetailThreadComment = require('../../../Domains/threadComments/enttities/DetailThreadComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetDetailThreadUseCase', () => {
  it('should ochestrating get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedListOfDetailComments = [
      new DetailThreadComment({
        id: 'comment-123',
        username: 'joemama',
        date: new Date('2015-03-25T12:00:00Z'),
        content: 'sebuah komen',
      }),
      new DetailThreadComment({
        id: 'comment-345',
        username: 'dicodingdingding',
        date: new Date('2015-03-25T12:00:12Z'),
        content: '**komentar telah dihapus**',
      }),
    ];

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicodingdingding',
    });

    const expectedCompleteDetailThread = new DetailThread(expectedDetailThread);
    expectedCompleteDetailThread.setComments(expectedListOfDetailComments);

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentsRepository();

    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getDetailCommentsByThreadId = jest.fn()
      .mockImplementation(
        () => {
          const rawComments = [
            new DetailThreadComment({
              id: 'comment-123',
              username: 'joemama',
              date: new Date('2015-03-25T12:00:00Z'),
              deleted_at: null,
              content: 'sebuah komen',
            }),
            new DetailThreadComment({
              id: 'comment-345',
              username: 'dicodingdingding',
              date: new Date('2015-03-25T12:00:12Z'),
              deleted_at: new Date(),
              content: '**komentar telah dihapus**',
            }),
          ];
          return Promise.resolve(DetailThreadComment.mapperForClientResp(rawComments));
        },
      );
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(
        () => Promise.resolve(expectedDetailThread),
      );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(getDetailThread).toStrictEqual(expectedCompleteDetailThread);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getDetailCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
  });
});
