// tslint:disable:no-require-imports

export const newRelic = () => {
  if (process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
    require('newrelic')
  }
}
