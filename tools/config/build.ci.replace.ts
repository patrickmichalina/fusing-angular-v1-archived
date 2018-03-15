import { config } from 'dotenv'

config()

// specific to HEROKU environments before given a SITE_URL
const siteUrlFromHeroku =
  process.env.HEROKU_APP_NAME &&
  `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`

// use this to replace values in your env/configs using environment variables from your CI/Deployment environment
export const OVERRIDES = {
  siteUrl: process.env.SITE_URL || siteUrlFromHeroku || '/'
}
