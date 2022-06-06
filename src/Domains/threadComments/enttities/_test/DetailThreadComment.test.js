const DetailThreadComment = require('../DetailThreadComment');

describe('DetailThreadComment entitites', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ieu ngarana comment',
    };

    // Action && Assert
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 696969,
      username: 'miawmiaw',
      date: new Date(),
    };

    // Action && Assert
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ieu teh comment',
      username: 'miawmiaw',
      date: new Date(),
    };

    // Action
    const detailThreadComment = new DetailThreadComment(payload);

    // Assert
    expect(detailThreadComment.id).toEqual(payload.id);
    expect(detailThreadComment.content).toEqual(payload.content);
    expect(detailThreadComment.username).toEqual(payload.username);
    expect(detailThreadComment.date).toEqual(payload.date);
  });
});
