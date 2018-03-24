import { Sparky } from 'fuse-box'
import { taskName } from '../../config/build.config'
import { SparkyFile } from 'fuse-box/sparky/SparkyFile'
import { readFileSync, writeFileSync } from 'fs'

// Temporary task to get AOT working until rxjs 6 is pervasive
Sparky.task(taskName(__filename), () =>
  Sparky.src('node_modules/angulartics2/**').file(
    'angulartics2.d.ts',
    (f: SparkyFile) => {
      return new Promise((res, rej) => {
        const text = readFileSync(f.filepath).toString()
        const regex = new RegExp(/rxjs\/interfaces/, 'g')
        const newText = text.replace(regex, 'rxjs')
        writeFileSync(f.filepath, newText)
        res()
      })
    }
  )
)
