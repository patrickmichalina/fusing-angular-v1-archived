import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Callback Page', () => {
  it('should have title', async () => {
    const page = browser.goto(`${baseUrl}/callback`)

    const text = await page.evaluate(() => document.title).end()

    expect(text).toContain('Callback')
  })
})
