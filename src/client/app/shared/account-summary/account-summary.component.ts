import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'pm-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSummaryComponent {
  @Input() readonly actImageUrl: string | undefined
  @Input() readonly actEmail: string | undefined
  @Input() readonly actName: string | undefined
}
