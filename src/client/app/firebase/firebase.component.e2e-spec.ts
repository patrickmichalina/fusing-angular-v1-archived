import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Firebase Page', () => {
  it('should have title', async () => {
    const page = browser.goto(`${baseUrl}/firebase`)
    const text = await page.evaluate(() => document.title)
    expect(text).toContain('Firebase')
  })
})
