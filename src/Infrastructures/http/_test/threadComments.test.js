const ThreadCommentsRepositoryTestHelper = require('../../../../tests/ThreadCommentsTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    // creating two users, one is thread creator and other is commentator
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'adhd',
      password: 'mentalbrokenisnotonefault',
      fullname: 'im happy',
    });

    await UsersTableTestHelper.addUser({
      id: 'user-666',
      username: 'meowmeow',
      password: 'meongmeong',
      fullname: 'aku anak anjing',
    });

    // create the thread
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'iki ieu this mantap',
      body: 'halo guys',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await ThreadCommentsRepositoryTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'ieu comment nu aing',
      };

      const server = await createServer(container);
      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const jwtToken = await jwtTokenManager.createAccessToken({
        username: 'meowmeow',
        id: 'user-666',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: 'threads/{threadId}/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(responseJson.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when request not contain valid authentication header', async () => {
      // Arrange
      const requestPayload = {
        content: 'ieu comment nu aing',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: 'threads/thread-123/comments',
        payload: requestPayload,
        headers: { Authorization: 'Bearer iniBukanJwt' },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
      expect(responseJson.status).toEqual('failed');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = { };

      const server = await createServer(container);
      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const jwtToken = await jwtTokenManager.createAccessToken({
        username: 'meowmeow',
        id: 'user-666',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: 'threads/thread-123/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(responseJson.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('failed');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'ieu comment nu aing',
      };

      const server = await createServer(container);
      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const jwtToken = await jwtTokenManager.createAccessToken({
        username: 'meowmeow',
        id: 'user-666',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: 'threads/thread-93849214/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(responseJson.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('failed');
      expect(responseJson.message).toBeDefined();
    });
  });
});
