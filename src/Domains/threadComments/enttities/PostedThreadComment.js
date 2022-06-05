class PostedThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload(payload) {
    const { id, content, owner } = payload;
    if (!id || !content || !owner) {
      throw new Error('POSTED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('POSTED_THREAD_COMMENT.NOT.MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostedThreadComment;
