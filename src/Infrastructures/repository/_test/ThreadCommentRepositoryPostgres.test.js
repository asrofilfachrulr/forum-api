/* eslint-disable max-len */
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostThreadComment = require('../../../Domains/threadComments/enttities/PostThreadComment');
const ThreadCommentsRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const pool = require('../../database/postgres/pool');
const PostedThreadComment = require('../../../Domains/threadComments/enttities/PostedThreadComment');
const ThreadCommentsRepositoryTestHelper = require('../../../../tests/ThreadCommentsTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

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

    // Post a comment with registered user and posted thread
    await ThreadCommentsRepositoryTestHelper.addComment({
      id: 'comment-987',
      content: 'dummieee',
      threadId: 'thread-123',
      userId: 'user-123',
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
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

  describe('verifyComment function', () => {
    it('should not throw NotFoundError if passed availabe commentId', async () => {
      // Arrange
      const id = 'comment-987';
      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, () => {});

      // Action & Assert
      expect(threadCommentRepositoryPostgres.verifyComment(id)).resolves.not.toThrowError();
    });

    it('should throw NotFoundError if passed not availabe commentId', async () => {
      // Arrange
      const id = 'comment-xxx';
      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, () => {});

      // Action & Assert
      expect(threadCommentRepositoryPostgres.verifyComment(id)).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw AuthorizationError if passed correct relation userId and commentId', async () => {
      // Arrange
      const commentId = 'comment-987';
      const userId = 'user-123';

      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, () => {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(userId, commentId))
        .resolves.not.toThrowError();
    });
    it('should throw AuthorizationError if passed wrong relation userId and commentId', async () => {
      // Arrange
      const commentId = 'comment-987';
      const userId = 'user-999';

      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, () => {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(userId, commentId))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete thread comment correctly', async () => {
      // Arrange
      const id = 'comment-987';

      const threadCommentRepositoryPostgres = new ThreadCommentsRepositoryPostgres(pool, () => {});

      // Action
      await threadCommentRepositoryPostgres.deleteComment(id);

      // Assert
      const result = await ThreadCommentsRepositoryTestHelper.getComment(id);
      expect(result).toBeUndefined();
    });
  });
});
