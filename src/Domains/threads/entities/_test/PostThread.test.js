const PostThread = require('../PostThread');

describe('PostThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'A Thread',
    };

    // Action & Assert
    expect(() => new PostThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 123,
      body: 'literally gue broken home',
    };

    // Action & Assert
    expect(() => new PostThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'Sabtu mendung',
      body: 'krisis menyerang lagi dan tidak ada siapaun untuk berbagi',
    };

    // Action
    const postThread = new PostThread(payload);

    // Assert
    expect(postThread).toBeInstanceOf(PostThread);
    expect(postThread.title).toEqual(payload.title);
    expect(postThread.body).toEqual(payload.body);
  });
});
