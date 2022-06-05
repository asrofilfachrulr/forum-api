const PostedThread = require('../PostedThread');

describe('PostThread entities', () => {
  it('should throw error when payload not contain not needed property', () => {
    // Arrange
    const payload = {
      title: 'lorem ipsum',
      owner: 'user-testtesssttest',
    };

    // Assert & Action
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type speficifaction', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'aku introvert',
      owner: 'user-1nt120v3rt',
    };

    // Action & Assert
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'th-123',
      title: 'halo kak',
      owner: 'user-m4nt4p',
    };

    // Action
    const postedThread = new PostedThread(payload);

    // Assert
    expect(postedThread).toBeInstanceOf(PostedThread);
    expect(postedThread.id).toEqual(payload.id);
    expect(postedThread.title).toEqual(payload.title);
    expect(postedThread.owner).toEqual(payload.owner);
  });
});
