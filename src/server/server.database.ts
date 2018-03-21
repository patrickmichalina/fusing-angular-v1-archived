import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Note } from './entity/note'

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
      connection.manager.find(Note).then(note => {
        // console
      })
    })
    .catch(error => {
      // tslint:disable-next-line:no-console
      // console.error(error)
      throw new Error(error)
    })
