import { baseUrl as url, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Account Page', () => {
  test.skip('should have title', async () => {
    const title = await browser
      .goto(`${url}`)
      .cookies.clearAll()
      .cookies.set({
        url,
        name: 'id-token',
        value: 'authenticatedUserToken'
      })
      .cookies.set({
        url,
        name: 'access-token',
        value: 'B418yhwBbRTK98jPwjh4yPGhFwZRSdzz'
      })
      .goto(`${url}/account`)
      .evaluate(() => document.title)
      .end()

    expect(title).toContain('Account')
  })
})
