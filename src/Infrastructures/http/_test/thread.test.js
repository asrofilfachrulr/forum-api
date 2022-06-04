const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
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

      // console.log(threadResponseJson);

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
      console.log(threadResponseJson);
      expect(threadResponse.statusCode).toEqual(401);
      expect(threadResponseJson.status).toEqual('fail');
      expect(threadResponseJson.message).toBeDefined();
      expect(threadResponseJson.message).not.toBeNull();
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
      const jwtToken = jwtTokenManager.createAccessToken({ username, id });

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
});
