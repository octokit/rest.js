const {getInstance} = require('../util')

describe('api.github.com', () => {
  beforeEach(function () {
    return getInstance('rename-repository')

    .then(github => {
      this.github = github

      github.authenticate({
        type: 'token',
        token: '0000000000000000000000000000000000000001'
      })
    })
  })

  it('github.repos.get() with previous name (https://github.com/cypress-io/cypress/issues/1314)', function () {
    return this.github.repos.edit({
      owner: 'octokit-fixture-org',
      repo: 'rename-repository',
      name: 'rename-repository-newname',
      // TODO: remove once #587 is resolved
      headers: {
        accept: 'application/vnd.github.v3+json'
      }
    })

    .then(() => {
      return this.github.repos.get({
        owner: 'octokit-fixture-org',
        repo: 'rename-repository',
        // TODO: remove once #587 is resolved
        headers: {
          accept: 'application/vnd.github.v3+json'
        }
      })
    })

    .then(() => {
      return this.github.repos.edit({
        owner: 'octokit-fixture-org',
        repo: 'rename-repository',
        // TODO: remove once #587 is resolved
        headers: {
          accept: 'application/vnd.github.v3+json'
        },
        name: 'rename-repository-newname',
        description: 'test description'
      })
    })
  })
})