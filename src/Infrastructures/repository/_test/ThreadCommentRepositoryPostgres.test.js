/* eslint-disable max-len */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostThreadComment = require('../../../Domains/threadComments/enttities/PostThreadComment');
const ThreadCommentsRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const pool = require('../../database/postgres/pool');
const PostedThreadComment = require('../../../Domains/threadComments/enttities/PostedThreadComment');

describe('ThreadCommentRepositoryPostgres', () => {
  beforeAll(async () => {
    // Register two users (thread creator and commentator)
    await UsersTableTestHelper.addUser(
      {
        id: 'user-123',
        username: 'mamank',
        password: 'gar0x',
        fullname: 'Tepung Beras Rosebrand',
      },
    );

    await UsersTableTestHelper.addUser(
      {
        id: 'user-666',
        username: 'tahu',
        password: 'bul4t',
        fullname: 'Digoreng Dadakan',
      },
    );

    // Post a thread with registered user
    await ThreadsTableTestHelper.addThread(
      new PostThread({
        id: 'thread-123',
        title: 'ieu judul',
        body: 'ieu body',
        owner: 'user-123',
      }),
    );
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComent function', () => {
    it('should persist post thread comment and return posted thread comment correctly', async () => {
      // Arrange
      const postThreadComment = new PostThreadComment({
        userId: 'user-666',
        threadId: 'thread-123',
        content: 'ieu comment teh',
      });

      const fakeIdGenerator = () => '123';

      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThreadComment = await threadCommentRepositoryPostgres.addComment(postThreadComment);

      // Assert
      expect(postedThreadComment).toStrictEqual(new PostedThreadComment({
        id: 'comment-123',
        content: 'ieu comment teh',
        owner: 'user-666',
      }));
    });
  });
});
