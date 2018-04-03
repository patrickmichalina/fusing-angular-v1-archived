import {
  Authorized,
  CurrentUser,
  Get,
  JsonController
} from 'routing-controllers'
import { auth } from 'firebase-admin'

@JsonController('/auth')
export class AuthController {
  /**
   * @swagger
   * /api/auth/firebase:
   *   get:
   *     tags: [auth]
   *     description: mint a custom token for firebase access
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: object
   *     security:
   *     - oauth:
   */
  @Get('/firebase')
  @Authorized()
  get(@CurrentUser() user: any) {
    const roles = (user && user[process.env.AUTH0_ROLES_KEY as string]) || {}
    return auth()
      .createCustomToken(user.sub, { email: user.email, roles })
      .then(customToken => ({ firebaseToken: customToken }))
  }
}
