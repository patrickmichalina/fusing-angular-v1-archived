import {
  Authorized,
  BadRequestError,
  Get,
  JsonController,
  Param
} from 'routing-controllers'
import { UserService } from '../../../services/user.service'

@JsonController('/users')
export class UsersController {
  constructor(private us: UserService) {}

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     tags: [users]
   *     description: get a user
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: object
   *     parameters:
   *     - name: id
   *       in: path
   *       required: true
   *       type: string
   *     security:
   *     - oauth:
   */
  @Get('/:id')
  @Authorized('admin')
  getUser(@Param('id') id: string) {
    return this.us
      .getUser(id)
      .toPromise()
      .catch(err => {
        throw new BadRequestError(err.original.response.body.message)
      })
  }
}
