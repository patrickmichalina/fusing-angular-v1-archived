import {
  Authorized,
  BadRequestError,
  Delete,
  Get,
  JsonController,
  Post,
  QueryParams
} from 'routing-controllers'
import {
  EntityFromBody,
  EntityFromQuery
} from 'typeorm-routing-controllers-extensions'
import { Note } from '../../../entity/note'
import { getConnectionManager } from 'typeorm'

@JsonController('/notes')
export class NotesController {
  readonly repo = getConnectionManager()
    .get()
    .getRepository(Note)
  /**
   * @swagger
   * tags:
   *   - name: notes
   *     description: operations on the application's notes
   */

  /**
   * @swagger
   * /api/notes:
   *   get:
   *     tags: [notes]
   *     description: get notes
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Note'
   *     parameters:
   *     - name: select
   *       in: query
   *       required: false
   *       type: string
   *       description: columns to include
   */
  @Get()
  get(@QueryParams() params: any) {
    return this.repo
      .find({
        take: params.take,
        skip: params.page,
        // join: TODO params.expand
        select: params.select && params.select.split(',')
      })
      .then(res => {
        return res
      })
      .catch(err => {
        throw new BadRequestError(err.message)
      })
  }

  /**
   * @swagger
   * /api/notes/{id}:
   *   get:
   *     operationId: getNoteById
   *     tags: [notes]
   *     description: get a note
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/Note'
   *     parameters:
   *     - name: id
   *       in: path
   *       required: true
   *       type: number
   */
  @Get('/:id')
  getNote(@EntityFromQuery('id') note: Note) {
    return note
  }

  /**
   * @swagger
   * /api/notes:
   *   post:
   *     operationId: createNote
   *     tags: [notes]
   *     description: create a note
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: object
   *           items:
   *             $ref: '#/definitions/Note'
   *     parameters:
   *     - name: text
   *       description: the note text
   *       in: formData
   *       required: true
   *       type: string
   *     security:
   *     - oauth:
   */
  @Post()
  @Authorized('admin')
  createNote(@EntityFromBody() note: Note) {
    return note.save()
  }

  /**
   * @swagger
   * /api/notes/{id}:
   *   delete:
   *     operationId: deleteNote
   *     tags: [notes]
   *     description: delete a note
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *        description: success
   *        schema:
   *          type: object
   *          items:
   *           $ref: '#/definitions/Note'
   *     parameters:
   *     - name: id
   *       in: path
   *       required: true
   *       type: number
   *     security:
   *     - oauth:
   *       - openid
   */
  @Delete('/:id')
  @Authorized('admin')
  deleteNote(@EntityFromQuery('id') note: Note) {
    throw new Error('Not Implemented')
  }
}
