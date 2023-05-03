import { Component } from '@angular/core';
import { SubscriptionService, ISubscription } from 'src/app/core/services/subscription.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  subscriptions: ISubscription[] = []; 

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.subscriptionService.getRecords().subscribe((response) => {
      this.subscriptions = response;
    });
  }
}
