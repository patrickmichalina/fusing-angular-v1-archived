import { Inject, Service } from 'typedi'
import { fromPromise } from 'rxjs/observable/fromPromise'
// tslint:disable-next-line:no-implicit-dependencies
import { MailData } from '@sendgrid/helpers/classes/mail'
import * as sendGrid from '@sendgrid/mail'
import { SENDGRID_API_KEY } from '../rest-api'

@Service()
export class EmailService {
  constructor(@Inject(SENDGRID_API_KEY) apiKey: string) {
    sendGrid.setApiKey(apiKey)
  }
  send(mailData: MailData) {
    return fromPromise(sendGrid.send(mailData))
  }

  sendMultiple(mailData: ReadonlyArray<MailData>) {
    return fromPromise(sendGrid.sendMultiple(mailData as any))
  }
}
