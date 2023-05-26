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
  priceHistory: [1, 3, 5, 7, 6, 9, 8, 6]
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
      //TEMP
      console.log('Setting forecast to dummy. Its length is' + this.dummyForecast.priceHistory.length);
      console.log('Now our forecasts data length is' + this.forecast?.priceHistory.length);
      this.forecast = this.dummyForecast;
    });

    //Plot price history, if exists
    //if (this.forecast  != null){
      console.log('Calling create chart');
      this.createChart();      
    //}
  }

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        //labels: [],
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [
          {
            label: "Average Sale Price",
            //data: [],
            data: [1, 3, 5, 7, 6, 9, 8, 6],
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
      

    });
 
    /*TODO
    if (this.forecast != null) {
      let monthCount = this.forecast.priceHistory.length;
      for (let j = 0; j < monthCount; j++){
        console.log('Pushing data into chart...');
        this.chart.labels.push(j);
        this.chart.datasets.data.push(this.forecast.priceHistory[j]);
      }  
    }*/
      let monthCount = this.dummyForecast.priceHistory.length;
      for (let j = 0; j < monthCount; j++) {
        console.log('Pushing data into chart...' + j);
        this.chart.labels.push(j.toString());
        this.chart.datasets.data.push(this.dummyForecast.priceHistory[j]);
      }
    
  }
}
