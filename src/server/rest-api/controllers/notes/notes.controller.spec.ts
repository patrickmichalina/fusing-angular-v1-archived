import { testApi } from '../../test-helper'
import { NotesController } from './notes.controller'

describe(NotesController.name, () => {
  it('should get notes collection', () => {
    return testApi
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('should get notes object', () => {
    return testApi
      .get('/api/notes/123')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })
})
