const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser(
      new RegisterUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'dicoding indonesia',
        password: 'kedipan matahari',
      }),
    );
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const id = 'thread-999';
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});

      // Action && Assert
      await expect(threadRepository.verifyThread(id)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      const id = 'thread-123';
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});

      ThreadsTableTestHelper.addThread(
        new PostThread({
          id,
          title: 'title',
          body: 'body',
          owner: 'user-123',
        }),
      );

      // Action && Assert
      await expect(threadRepository.verifyThread(id)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist post thread and return posted thread correctly', async () => {
      // Arrange
      const postThread = new PostThread({
        id: 'user-123',
        title: 'ieu judul',
        body: 'ieu body euy mantap',
      });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await threadRepository.addThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: postThread.title,
        owner: postThread.id,
      }));
    });
  });

  describe('getDetailThreadById function', () => {
    it('should return DetailThread object from relations correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const date = new Date(86400000);

      const thread = {
        id: threadId,
        title: '[A THREAD]',
        body: 'kek gw tuh udh mlz bgt sm org org disekitar gueh',
      };

      await ThreadsTableTestHelper.addThread({
        ...thread,
        owner: 'user-123',
        date,
      });

      const expectedDetailThread = new DetailThread({
        ...thread,
        username: 'dicoding',
        date,
      });

      // Action
      const repository = new ThreadRepositoryPostgres(pool, () => {});
      const detailThread = await repository.getDetailThreadById(threadId);

      // Assert
      expect(detailThread).toStrictEqual(expectedDetailThread);
    });
  });
});
