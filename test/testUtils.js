const request = require('supertest');
const _ = require('lodash');
const debug = require('debug')('boilerplate:test:dbutils');

module.exports = function TestUtils(app) {
  function json(verb, urlIn, query, token) {
    const qString = [];
    _.each(_.keys(query), (item) => {
      qString.push(`${item}=${JSON.stringify(query[item])}`);
    });
    if (token) {
      qString.push(`access_token=${token}`);
    }

    const str = _.join(qString, '&');

    /* eslint-disable no-extra-boolean-cast */
    const url = (!!str ? `/api/v1${urlIn}?${str}` : `/api/v1${urlIn}`);
    /* eslint-enable */

    debug(`${verb}: ${url}`);
    const output = request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return output
      .expect('Content-Type', /json/);
  }

  function login(email, password) {
    return json('post', '/MyUsers/login')
      .send({
        email,
        password,
      })
      .expect(200);
  }

  function logout(token) {
    return json('post', '/MyUsers/login', {}, token)
      .send()
      .expect(200);
  }

  return {
    json,
    login,
    logout,
  };
};
