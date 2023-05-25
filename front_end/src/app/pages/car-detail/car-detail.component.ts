import { Component } from '@angular/core';
import { ICarListing,CarDetailsService, ISearchForecast} from 'src/app/services/car-details.service';
import { ActivatedRoute } from '@angular/router';
import {Chart} from 'chart.js';

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
  forecast: ISearchForecast | null = null;
  chart: any;

  constructor(private route: ActivatedRoute,
    private carDetailsService: CarDetailsService){
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.carDetailsService.getBylistingId(this.id).subscribe((response) => {
      this.carListing = response;
    });

    //Plot price history, if exists
    if (this.forecast  != null){
      this.createChart();      
    }
  }

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: [],
        datasets: [
          {
            label: "Average Sale Price",
            data: [],
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
      

    });
    if (this.forecast != null) {
      let monthCount = this.forecast.priceHistory.length;
      for (let j = 0; j < monthCount; j++){
        this.chart.labels.push(j);
        this.chart.datasets.data.push(this.forecast.priceHistory[j]);
      }
    }
  }
}
