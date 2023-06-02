import { Component } from '@angular/core';
import { ICarListing,CarDetailsService, ISearchForecast} from 'src/app/services/car-details.service';
import { ActivatedRoute } from '@angular/router';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})


export class CarDetailComponent {
  //TEMP
  dummyForecast = {
  search: "dummy",
  avgTimeOnMarket: 0,
  avgPrice: 0,
  averageMileage: 0,
  ttl: 0,
  priceHistory: [1, 2, 3, 4, 5, 6, 7, 8],
  forecastRegion: "Building M",
}
  // from backend
  carListing: ICarListing | null = null;
  loading: boolean = true;
  id: string;
  forecast: ISearchForecast | null = null;
  chart: any;

  constructor(private route: ActivatedRoute,
    private carDetailsService: CarDetailsService){
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.carDetailsService.getBylistingId(this.id).subscribe((response) => {
      this.carListing = response;
      if (this.forecast){
        console.log('GOOD - I am using my own forecast');
        this.populateChart(this.forecast.priceHistory);
      }
      else {
        console.log('Making a chart from the dummy....')
          this.populateChart(this.dummyForecast.priceHistory);
      }
      
    });
  }

  createChart(prices: Number[], dates: String[]){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: dates,
        //labels: ['1', '2', '3'],
        datasets: [
          {
            label: "Average Sale Price",
            data: prices,
            //data: [8, 7 ,10],
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
      
    });
  }
  //TODO - Is this necessary after integration?
  bindData(input: Number[]){
    this.forecast = this.dummyForecast;
  }
  populateChart(input: Number[]){
    console.log("Populating chart...");
    let dateRange: string[] =  [];
    let prices: Number[] = [];
    let date: Date = new Date();
    let month = date.getMonth;
    let year = date.getFullYear;
    console.log("Start date: " + date.toString());
    for (let j = 0; j < input.length; j++){
      let nextDate = date.getMonth() - j;
      if (nextDate < 1) {
        nextDate += 12;
      }      
      dateRange.unshift(nextDate.toString());
      console.log(nextDate.toString());
      //this.chart.labels.unshift(nextDate.toString());
      //TODO - Finalize
      if (this.forecast != null){
        console.log("$ " + this.forecast.priceHistory[j]);
        //this.chart.datasets.data.push(this.forecast.priceHistory[j]);
        prices.push(this.forecast.priceHistory[j]);
      }
      else {
        console.log("Dummy: $ " + this.dummyForecast.priceHistory[j]);
        //this.chart.datasets.data.push(this.dummyForecast.priceHistory[j]);
        prices.push(this.dummyForecast.priceHistory[j]);
      }      
    }
    this.createChart(prices, dateRange);
  }
}
