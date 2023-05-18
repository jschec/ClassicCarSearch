import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  filterForm: FormGroup;
  regionOptions = [
    "Northeast",
    "Southwest",
    "West",
    "Southeast",
    "Midwest"
  ]

  constructor(private router: Router) {
    const minYear = 1885;
    const maxYear = new Date().getFullYear() + 1;

    this.filterForm = new FormGroup({
      make: new FormControl(''),
      model: new FormControl(''),
      region: new FormControl(''),
      startYear: new FormControl(
        minYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      endYear: new FormControl(
        maxYear, [Validators.min(minYear), Validators.max(maxYear)]
      )
    });
  }


  /**
   * Handles the submission of the specified search criteria.
   */
  public onClickSubmit() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        searchCriteria: JSON.stringify(this.filterForm.value)
      }
    }

    this.router.navigate(['/search'], navigationExtras);
  }
}
