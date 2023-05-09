import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() {
    const minYear = 1885;
    const maxYear = new Date().getFullYear() + 1;

    this.filterForm = new FormGroup({
      make: new FormControl(''),
      model: new FormControl(''),
      selectedRegion: new FormControl(''),
      startYear: new FormControl(
        minYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      endYear: new FormControl(
        maxYear, [Validators.min(minYear), Validators.max(maxYear)]
      )
    });
  }

  ngOnInit(): void {
  }

  onClickSubmit() {
    console.log(this.filterForm.value);
  }
}
