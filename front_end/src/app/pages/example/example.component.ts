import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CarsService, ICar } from 'src/app/core/services/cars.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  cars: ICar[] = [];

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private carsService: CarsService) { }

  ngOnInit(): void {
    this.carsService.getRecords().subscribe((response) => {
      this.cars = response;

      console.log(this.cars);
    });
  }
}
