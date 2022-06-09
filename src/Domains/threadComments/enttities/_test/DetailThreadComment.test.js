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

  it('should return correct Object using rest function from a DetailThread instance', () => {
    // Arrange
    const date = new Date();

    const payload = {
      id: 'comment-123',
      content: 'ieu teh comment',
      username: 'miawmiaw',
      date,
    };

    const detailThreadComment = new DetailThreadComment(payload);

    // Action
    const restFromDetailThread = detailThreadComment.rest();

    // Assert
    expect(restFromDetailThread).toStrictEqual({
      id: 'comment-123',
      content: 'ieu teh comment',
      username: 'miawmiaw',
      date,
    });
  });

  it('should mapping object and create new DetailThread object correctly', () => {
    // Arrange
    const dates = [new Date('1999'), new Date('2002'), new Date('2005')];
    const payload = [
      {
        id: 'comments-123',
        date: dates[0],
        username: 'anya',
        content: 'ieu comment',
        is_delete: false,
      },
      {
        id: 'comments-124',
        date: dates[1],
        username: 'anya',
        content: 'ieu comment oge',
        is_delete: true,
      },
      {
        id: 'comments-125',
        date: dates[2],
        username: 'fuji',
        content: 'ieu comment lainna',
        is_delete: false,
      },
    ];

    // Action
    const mappedObject = DetailThreadComment.mapperForClientResp(payload);

    // Assert
    expect(mappedObject[0]).toStrictEqual(new DetailThreadComment({
      id: 'comments-123',
      date: dates[0],
      username: 'anya',
      content: 'ieu comment',
    }));
    expect(mappedObject[1]).toStrictEqual(new DetailThreadComment({
      id: 'comments-124',
      date: dates[1],
      username: 'anya',
      content: '**komentar telah dihapus**',
    }));
    expect(mappedObject[2]).toStrictEqual(new DetailThreadComment({
      id: 'comments-125',
      date: dates[2],
      username: 'fuji',
      content: 'ieu comment lainna',
    }));
  });
});
