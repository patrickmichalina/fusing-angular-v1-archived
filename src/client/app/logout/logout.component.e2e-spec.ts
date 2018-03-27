import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Logout Page', () => {
  it('should have title', async () => {
    const page = browser.goto(`${baseUrl}/logout`)
    const text = await page.evaluate(() => document.title)
    expect(text).toContain('Home')
  })
})
