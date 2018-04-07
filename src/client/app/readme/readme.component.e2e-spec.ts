import { baseUrl, browser } from '../../../../tools/test/jest.e2e-setup'

describe('Readme Page', () => {
  it('should have title', async () => {
    expect.assertions(1)

    const page = browser.goto(`${baseUrl}/readme`)

    const text = await page.evaluate(() => document.title).end()

    expect(text).toContain('Readme')
  })
})
