/* eslint-disable camelcase */
class DetailThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, date, username, content,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
  }

  _verifyPayload(payload) {
    const {
      id, date, username, content,
    } = payload;

    if (!id || !date || !username || !content) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof date !== 'object' || typeof username !== 'string' || typeof content !== 'string') {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  rest() {
    return {
      id: this.id,
      date: this.date,
      username: this.username,
      content: this.content,
    };
  }

  static mapperForClientResp(comments) {
    return comments.map((comment) => {
      const {
        id, date, username, content, deleted_at,
      } = comment;

      const fixedContent = deleted_at ? '**komentar telah dihapus**' : content;
      return new DetailThreadComment({
        id,
        date,
        username,
        content: fixedContent,
      });
    });
  }
}

module.exports = DetailThreadComment;
