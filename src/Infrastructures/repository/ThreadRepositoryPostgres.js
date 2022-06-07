const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

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
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [threadId, title, body, userId, new Date()],
    };

    const result = await this._pool.query(query);

    return new PostedThread({ ...result.rows[0] });
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t JOIN users u ON t.owner = u.id WHERE t.id = $1 LIMIT 1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const detailThread = new DetailThread({ ...result.rows[0] });

    return detailThread;
  }

  async verifyThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1 LIMIT 1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
