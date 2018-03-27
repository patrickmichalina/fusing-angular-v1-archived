import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Account Page', () => {
  it('should have title', async () => {
    const page = browser.goto(`${baseUrl}/account`)
    const text = await page.evaluate(() => document.title)
    expect(text).toContain('Account')
  })
})
