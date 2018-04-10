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
  appName:
    process.env.HEROKU_APP_NAME || process.env.APP_NAME || 'Fusing Angular',
  appShortName: process.env.APP_SHORT_NAME || 'Fusing NG',
  siteUrl: process.env.SITE_URL || siteUrlFromHeroku || '/',
  rolesKey: process.env.AUTH0_ROLES_KEY,
  pwaUpdateInterval: +(process.env.PWA_UPDATE_INTERVAL || 100000),
  revision,
  auth0: {
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN,
    redirectUri: process.env.AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile email'
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  }
}
