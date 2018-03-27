import { config } from 'dotenv'
import { execSync } from 'child_process'

config()

// specific to HEROKU environments before given a SITE_URL
const siteUrlFromHeroku =
  process.env.HEROKU_APP_NAME &&
  `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`

const getRevViaGit = () => {
  try {
    return execSync('git rev-parse HEAD')
      .toString()
      .trim()
  } catch (err) {
    return ''
  }
}

const revision = process.env.SOURCE_VERSION || getRevViaGit()

// use this to replace values in your env/configs using environment variables from your CI/Deployment environment
export const OVERRIDES = {
  siteUrl: process.env.SITE_URL || siteUrlFromHeroku || '/',
  revision,
  auth0: {
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN,
    redirectUri: process.env.AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile email'
  },
  rolesKey: process.env.AUTH0_ROLES_KEY
}
