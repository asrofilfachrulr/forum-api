const PostThreadComment = require('../PostThreadComment');

describe('PostThreadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'woy',
    };

    // Action && Assert
    expect(() => new PostThreadComment(payload)).toThrowError('POST_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 123,
      threadId: 'thread-123321',
      content: 'ini comment euy',
    };

    // Action && Assert
    expect(() => new PostThreadComment(payload)).toThrowError('POST_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostThreadComment object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'ini komentar',
    };

    // Action
    const postThreadComment = new PostThreadComment(payload);

    // Assert
    expect(postThreadComment.userId).toEqual(payload.userId);
    expect(postThreadComment.threadId).toEqual(payload.threadId);
    expect(postThreadComment.content).toEqual(payload.content);
  });
});
