const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentsRepositoryTestHelper = require('../../../../tests/ThreadCommentsTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailThreadComment = require('../../../Domains/threadComments/enttities/DetailThreadComment');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and presisted thread', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'title',
        body: 'body body',
      };
      const userRequestPayload = {
        username: 'anya',
        password: 'supermantap',
        fullname: 'anya fachri',
      };

      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const server = await createServer(container);

      // Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const userResponseJson = JSON.parse(userResponse.payload);

      const { username, id } = userResponseJson.data.addedUser;
      const jwtToken = await jwtTokenManager.createAccessToken({ username, id });
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      // Assert
      expect(threadResponse.statusCode).toEqual(201);
      expect(threadResponseJson.status).toEqual('success');
      expect(threadResponseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request not contain valid authentication header', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'title',
        body: 'body body',
      };
      const server = await createServer(container);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: { Authorization: 'Bearer iniJwtSalahWoi' },
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(401);
      expect(threadResponseJson.message).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'title',
      };
      const userRequestPayload = {
        username: 'anya',
        password: 'supermantap',
        fullname: 'anya fachri',
      };

      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const server = await createServer(container);

      // Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const userResponseJson = JSON.parse(userResponse.payload);
      const { username, id } = userResponseJson.data.addedUser;
      const jwtToken = await jwtTokenManager.createAccessToken({ username, id });

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(400);
      expect(threadResponseJson.status).toEqual('fail');
      expect(threadResponseJson.message).toBeDefined();
      expect(threadResponseJson.message).not.toBeNull();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'title',
        body: true,
      };
      const userRequestPayload = {
        username: 'anya',
        password: 'supermantap',
        fullname: 'anya fachri',
      };

      const jwtTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const server = await createServer(container);

      // Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const userResponseJson = JSON.parse(userResponse.payload);
      const { username, id } = userResponseJson.data.addedUser;
      const jwtToken = await jwtTokenManager.createAccessToken({ username, id });

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(400);
      expect(threadResponseJson.status).toEqual('fail');
      expect(threadResponseJson.message).toBeDefined();
      expect(threadResponseJson.message).not.toBeNull();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return detail thread correctly', async () => {
      // Arrange
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

      const thread = {
        id: 'thread-123',
        title: 'ieu judul',
        body: 'ieu body,',
      };

      const date = new Date('1-1-1970');

      // Post a thread with registered user
      await ThreadsTableTestHelper.addThread(
        {
          ...thread,
          owner: 'user-123',
          date,
        },
      );

      const threadId = 'thread-123';
      const dates = [
        new Date('1-1-1960'),
        new Date('1-2-1968'),
        new Date('1-3-1979'),
      ];

      const comments = [
        {
          id: 'comment-321',
          userId: 'user-666',
          threadId: 'thread-123',
          content: 'ieu comment oge',
          date: dates[1],
          deleted_at: new Date(),
        },
      ];

      comments.forEach(async (comment) => {
        await ThreadCommentsRepositoryTestHelper.addComment(comment);
      });

      comments[0].username = 'tahu';

      const expectedListOfDetailThreadComments = DetailThreadComment
        .mapperForClientResp(comments)
        .map((c) => c.rest());

      const expectedDetailThread = new DetailThread({
        ...thread,
        username: 'mamank',
        date,
      });

      expectedDetailThread.date = expectedDetailThread.date.toJSON();
      expectedListOfDetailThreadComments.forEach((comment) => {
        // eslint-disable-next-line no-param-reassign
        comment.date = comment.date.toJSON();
      });
      const expectedCompleteDetailThread = {
        ...expectedDetailThread,
        comments: expectedListOfDetailThreadComments,
      };

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toEqual(expectedCompleteDetailThread);
    });
  });
});
