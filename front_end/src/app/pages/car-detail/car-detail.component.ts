import { Component } from '@angular/core';
import { ICarListing,CarDetailsService, ISearchForecast} from 'src/app/services/car-details.service';
import { ActivatedRoute } from '@angular/router';

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
      
    }
  }
}
