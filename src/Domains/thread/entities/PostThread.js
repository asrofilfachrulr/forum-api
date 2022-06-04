class PostThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload(payload) {
    const { id, title, body } = payload;

    if (!id || !title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostThread;
