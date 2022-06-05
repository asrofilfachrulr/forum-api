const PostedThreadComment = require('../PostedThreadComment');

describe('PostedThreadComment entitites', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ieu ngarana comment',
    };

    // Action && Assert
    expect(() => new PostedThreadComment(payload)).toThrowError('POSTED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 696969,
      owner: 'user-123',
    };

    // Action && Assert
    expect(() => new PostedThreadComment(payload)).toThrowError('POSTED_THREAD_COMMENT.NOT.MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ieu ngarana comment',
      owner: 'user-123',
    };

    // Action
    const postedThreadComment = new PostedThreadComment(payload);

    // Assert
    expect(postedThreadComment.id).toEqual(payload.id);
    expect(postedThreadComment.content).toEqual(payload.content);
    expect(postedThreadComment.owner).toEqual(payload.owner);
  });
});
