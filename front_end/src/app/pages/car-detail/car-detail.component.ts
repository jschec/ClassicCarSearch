import { Component } from '@angular/core';
import { ICarListing,CarDetailsService, ISearchForecast, } from 'src/app/services/car-details.service';
import { ICar } from 'src/app/services/cars.service';
import { ActivatedRoute } from '@angular/router';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})


export class CarDetailComponent {
  // from backend
  carListing: ICarListing | null = null;
  loading: boolean = true;
  id: string;
  car: ICar | null = null;
  forecast: ISearchForecast | null = null;
  chart: any;
  constructor(private route: ActivatedRoute,
    private carDetailsService: CarDetailsService){
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.carDetailsService.getBylistingId(this.id).subscribe((response) => {
      //Grab car listing from response
      this.carListing = response;
      //Grab forecast from car listing
      this.forecast = this.carListing.car.forecast;      
      //Populate chart
      if (this.forecast){        
        this.populateChart(this.forecast?.priceHistory);
      }      
    });
  }

  createChart(prices: Number[], dates: String[]){
    this.chart = new Chart("MyChart", {
      type: 'bar', 

      data: {// values on X-Axis
        labels: dates,        
        datasets: [
          {
            label: "Average Sale Price",
            data: prices,
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
      
    });
  }
  //Populate Chart with Price Data
  populateChart(input: Number[]){
    console.log("Populating chart with " + input?.length + " values");
    let dateRange: string[] =  [];
    let prices: Number[] = [];
    let date: Date = new Date();
    let month = date.getMonth;
    let year = date.getFullYear;
    console.log("Start date: " + date.toString());
    for (let j = 0; j < input?.length; j++){
      let nextDate = date.getMonth() - j;
      if (nextDate < 1) {
        nextDate += 12;
      }      
      dateRange.unshift(nextDate.toString());
      if (this.forecast != null){
        console.log("$ " + this.forecast?.priceHistory[j]);
        prices.push(this.forecast?.priceHistory[j]);
      }
      else {
        console.log('No valid forecast found');        
      }      
    }
    this.createChart(prices, dateRange);
  }
}
