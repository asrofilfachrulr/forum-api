const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const threadComments = require('../../Interfaces/http/api/threadComments');

module.exports = (container) => ([
  {
    plugin: users,
    options: { container },
  },
  {
    plugin: threads,
    options: { container },
  },
  {
    plugin: threadComments,
    options: { container },
  },
  {
    plugin: authentications,
    options: { container },
  },
]);
