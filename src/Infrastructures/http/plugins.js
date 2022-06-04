const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');

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
    plugin: authentications,
    options: { container },
  },
]);
