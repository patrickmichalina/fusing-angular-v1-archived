import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Note } from './entity/note'
import chalk from 'chalk'
const log = console.log

const baseSettings = {
  entities: [Note],
  migrations: ['./src/server/migration/**/*.ts'],
  synchronize: true
}

const dynamic = process.env.DATABASE_URL
  ? {
      url: process.env.DATABASE_URL
      // extra: {
      //   ssl: true
      // }
    }
  : {
      host: 'localhost',
      database: 'postgres',
      port: 5432
    }

export const initDb = () =>
  createConnection({
    type: 'postgres',
    ...baseSettings,
    ...dynamic
  })
    .then(connection => {
      log(chalk.green('Connected to database!'))
    })
    .catch(error => {
      log(chalk.red('Database Connection Error: ', error))
      log(chalk.red("Connections to your app's API will likely fail"))
    })
