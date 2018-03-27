import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Callback Page', () => {
  it('should have title', async () => {
    const page = browser.goto(`${baseUrl}/not-found`)

    const text = await page.evaluate(() => document.title)

    expect(text).toContain('Callback')
  })
})
