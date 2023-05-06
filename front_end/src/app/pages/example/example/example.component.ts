import { Component } from '@angular/core';
import { CarsService, ICar } from 'src/app/core/services/cars.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  cars: ICar[] = [];

  constructor(private carsService: CarsService) { }

  ngOnInit(): void {
    this.carsService.getRecords().subscribe((response) => {
      this.cars = response;

      console.log(this.cars);
    });
  }
}
