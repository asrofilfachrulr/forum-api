const ThreadRepository = require('../../Domains/thread/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const { id: userId, title, body } = postThread;
    const threadId = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [threadId, title, body, userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
