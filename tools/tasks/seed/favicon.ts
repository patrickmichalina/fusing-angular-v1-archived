import { Sparky } from 'fuse-box'
import { readFile, writeFile, readFileSync } from 'fs'
import { sync as mkdirp } from 'mkdirp'
import { BUILD_CONFIG, taskName } from '../../config/build.config'

// tslint:disable:no-require-imports
const favicons = require('favicons')
const jsdom = require('jsdom')
const svg2png = require('svg2png')
const { JSDOM } = jsdom

Sparky.task(taskName(__filename), () => {
  return new Promise((resolve, reject) => {
    const favicon = BUILD_CONFIG.favicon

    let src = readFileSync(favicon.src)
    svg2png(src, { width: 1200, height: 1200 }).then((buffer: Buffer) => {
      favicons(buffer, favicon.config, (error: any, response: any) => {
        if (error) {
          // tslint:disable:no-console
          console.log(error.status)
          console.log(error.name)
          console.log(error.message)
          return
        }

        const htmlHeadBlock = (response.html as Array<string>).reduce(
          (prev, curr) => {
            return `${prev}\n${curr}`
          }
        )

        mkdirp(`./${BUILD_CONFIG.clientAssetsDir}/assets/favicons`)

        const imagePromises = (response.images as Array<{
          name: string
          contents: Buffer
        }>).map(
          image =>
            new Promise((resolve1, reject1) => {
              return writeFile(
                `./${BUILD_CONFIG.clientAssetsDir}/favicons/${image.name}`,
                image.contents,
                (err: any) => {
                  if (err) reject1(err)

                  return resolve1(image.contents)
                }
              )
            })
        )

        const filePromises = (response.files as Array<{
          name: string
          contents: string
        }>).map(
          file =>
            new Promise((resolve2, reject2) => {
              if (file.name === 'manifest.json') {
                const manifest = JSON.parse(file.contents)
                manifest.short_name = favicon.config.short_name
                file.contents = JSON.stringify(manifest, undefined, 2)
              }
              writeFile(
                `./${BUILD_CONFIG.clientAssetsDir}/favicons/${file.name}`,
                file.contents,
                (err: any) => {
                  if (err) reject2(err)

                  return resolve2(file.contents)
                }
              )
            })
        )

        return Promise.all<any>([...imagePromises, ...filePromises]).then(
          () => {
            const filePath = `./${BUILD_CONFIG.clientDir}/index.html`
            readFile(filePath, 'utf-8', (err, data) => {
              if (err) return reject(err)
              const existingHtml = new JSDOM(data)
              const newHtml = new JSDOM(htmlHeadBlock)
              const existingHtmlHead = existingHtml.window.document
                .head as HTMLHeadElement
              const newHtmlHead = newHtml.window.document
                .head as HTMLHeadElement
              const children = Array.from(newHtmlHead.children)
              const toReset = existingHtmlHead.querySelectorAll(
                '[data-inj-fav]'
              )
              Array.from(toReset).forEach(a => a.remove())
              children.forEach((a: HTMLElement) =>
                a.setAttribute('data-inj-fav', '')
              )
              children.forEach(el => existingHtmlHead.appendChild(el))
              writeFile(
                filePath,
                existingHtml.serialize(),
                { encoding: 'utf-8' },
                writeErr => {
                  if (writeErr) return reject(writeErr)
                  return resolve()
                }
              )
            })
          }
        )
      })
    })
  })
})
