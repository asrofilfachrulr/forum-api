const DetailThreadComment = require('../../../threadComments/enttities/DetailThreadComment');
const DetailThread = require('../DetailThread');

describe('DetailThread entitites', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };

    // Action && Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification (1/2)', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 696969,
      body: 'ieu mantap',
      username: 'miawmiaw',
      date: new Date(),
      comments: 'loba komen sia',
    };

    // Action && Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload not meet data type specification (2/2)', () => {
    // Arrange
    const generateDetailThreadComment = () => new DetailThreadComment({
      id: `comment-${Math.floor(Math.random() * 1000)}`,
      date: new Date(),
      username: 'dicodeung',
      content: 'mantap',
    });

    const payload = {
      id: 'thread-123',
      title: 'ieu title',
      body: 'ieu mantap',
      username: 'miawmiaw',
      date: new Date(),
      comments: [
        generateDetailThreadComment(),
        generateDetailThreadComment(),
        { date: 'aku bukan date' },
        generateDetailThreadComment(),
      ],
    };

    // Action && Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    // Arrange
    const generateDetailThreadComment = () => new DetailThreadComment({
      id: `comment-${Math.floor(Math.random() * 1000)}`,
      date: new Date(),
      username: 'dicodeung',
      content: 'mantap',
    });

    const payload = {
      id: 'thread-123',
      title: 'ieu title',
      body: 'ieu mantap',
      username: 'miawmiaw',
      date: new Date(),
      comments: [
        generateDetailThreadComment(),
        generateDetailThreadComment(),
        generateDetailThreadComment(),
      ],
    };
    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.comments).toEqual(payload.comments);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
  });
});
