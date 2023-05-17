import { Component } from '@angular/core';
import { SubscriptionService, ISubscription } from 'src/app/core/services/subscription.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  userId: string = 'f8b51edc-c435-4be6-b2c7-fbf9a72d3d54';
  subscriptions: ISubscription[] = [];
  selectedSubscriptionId: string | undefined = undefined;
  selectedSubscriptionName: string | undefined = undefined;


  constructor(
    private subscriptionService: SubscriptionService, 
    private userService: UserService
  ) { 
    this.subscriptionService.getRecords().subscribe((response) => {
      this.subscriptions = response;
    });

    this.userService.getUser(this.userId).subscribe((response) => {
      this.selectedSubscriptionId = response.subscription;
      this.selectedSubscriptionName = this.subscriptions.find((subscription) => {
        return subscription.id === this.selectedSubscriptionId;
      })?.name;
    });
  };

  public onSetSubscription(subscription: ISubscription) {
    this.userService.setSubscription(this.userId, subscription.id).subscribe(() => {
      this.selectedSubscriptionId = subscription.id;
      this.selectedSubscriptionName = subscription.name;
    });
  }
}
