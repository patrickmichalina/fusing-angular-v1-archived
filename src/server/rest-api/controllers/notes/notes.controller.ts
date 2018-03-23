import { Authorized, Get, JsonController, Param } from 'routing-controllers'
import { Injectable } from '@angular/core'
import { of } from 'rxjs/observable/of'

@JsonController()
@Injectable()
export class NotesController {
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
   */
  @Authorized('admin')
  @Get('/notes')
  get() {
    return of([{ test: 'this is a note!' }]).toPromise()
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
   *           item:
   *             $ref: '#/definitions/Note'
   *   parameters:
   *   - name: id
   *     in: path
   *     required: true
   *     type: number
   */
  @Get('/notes/:id')
  getNote(@Param('id') id: number) {
    return of({ test: 'this is a note!' }).toPromise()
  }
}
