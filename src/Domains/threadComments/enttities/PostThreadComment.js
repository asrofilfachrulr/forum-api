class PostThreadComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { userId, threadId, content } = payload;
    this.userId = userId;
    this.threadId = threadId;
    this.content = content;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyPayload(payload) {
    const { userId, threadId, content } = payload;

    if (!content || !threadId || !userId) {
      throw new Error('POST_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('POST_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostThreadComment;
