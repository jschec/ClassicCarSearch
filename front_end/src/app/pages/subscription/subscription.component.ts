import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { 
  SubscriptionService, ISubscription 
} from 'src/app/core/services/subscription.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  isLoading: boolean = true;
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

    this.userService.getCurrentUser().pipe(
      delay(1000), // To allow for demo of loading screen
    ).subscribe((response) => {
      this.selectedSubscriptionId = response.subscription;
      this.selectedSubscriptionName = this.subscriptions.find((subscription) => {
        return subscription.id === this.selectedSubscriptionId;
      })?.name;

      this.isLoading = false;
    });
  };

  /**
   * Assigns the specified subscription to the current user.
   * 
   * @param subscription The subscription to assign to the current user.
   */
  public onSetSubscription(subscription: ISubscription) {
    
    this.userService.setSubscription(subscription.id).subscribe(() => {
      // Update the selected subscription with specified subscription
      // since API call was successful
      this.selectedSubscriptionId = subscription.id;
      this.selectedSubscriptionName = subscription.name;
    });
  }
}
