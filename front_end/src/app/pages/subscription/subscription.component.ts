import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { 
  SubscriptionService, ISubscription 
} from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  isLoading: boolean = true;
  currentUserId: string | undefined = undefined;
  subscriptions: ISubscription[] = [];
  selectedSubscriptionId: string | undefined = undefined;
  selectedSubscriptionName: string | undefined = undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private userService: UserService
  ) {
    this.subscriptionService.getRecords().subscribe((response) => {
      this.subscriptions = response;
    });

    this.authService.getCurrentUser().pipe(
      delay(1000), // To allow for demo of loading screen
    ).subscribe((response) => {
      // If user is not authenticated, redirect to login page
      if (!response.isAuthenticated) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.currentUserId = response.user!.id;

      if (response.user!.subscription) {
        this.selectedSubscriptionId = response.user!.subscription;

        this.selectedSubscriptionName = this.subscriptions.find((subscription) => {
          return subscription.id === this.selectedSubscriptionId;
        })?.name;
      } else {
        this.selectedSubscriptionId = undefined;
        this.selectedSubscriptionName = "None";
      }

      this.isLoading = false;
    });
  };

  /**
   * Assigns the specified subscription to the current user.
   * 
   * @param subscription The subscription to assign to the current user.
   */
  public onSetSubscription(subscription: ISubscription) {
    
    this.userService.setSubscription(this.currentUserId!, subscription.id).subscribe(() => {
      // Update the selected subscription with specified subscription
      // since API call was successful
      this.selectedSubscriptionId = subscription.id;
      this.selectedSubscriptionName = subscription.name;
    });
  }
}
