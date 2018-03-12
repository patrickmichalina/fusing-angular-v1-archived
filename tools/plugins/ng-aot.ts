import { File } from 'fuse-box/core/File'

const defaults = {}

export interface NgAotPluginOptions { }

export class NgAotPluginClass {
  public test: RegExp = /-routing.module.js/

  constructor(opts: NgAotPluginOptions = defaults) { }

  transform(file: File) {
    const regex1 = new RegExp(/.module'/, 'g')
    const regex2 = new RegExp(/Module\);/, 'g')
    file.contents = file.contents.replace(regex1, '.module.ngfactory\'')
    file.contents = file.contents.replace(regex2, 'ModuleNgFactory);')
  }
}

export const NgAotPlugin = (options?: NgAotPluginOptions) => new NgAotPluginClass(options);