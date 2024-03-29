import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('About', () => {
  it('should have title', async () => {
    expect.assertions(1)
    const page = browser.goto(`${baseUrl}/about`)

    const text = await page.evaluate(() => document.title).end()

    expect(text).toContain('About')
  })
})
