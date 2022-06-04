const PostThread = require('../../Domains/thread/entities/PostThread');

class PostThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const result = await this._threadRepository.addThread(
      new PostThread(useCasePayload),
    );

    return result;
  }
}

module.exports = PostThreadUseCase;
