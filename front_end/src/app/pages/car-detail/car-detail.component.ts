import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { of, Observable, concat } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { ICarListing,CarDetailsService} from 'src/app/core/services/car-details.service';
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

 

  constructor(private route: ActivatedRoute,
    private carDetailsService: CarDetailsService){
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {

    this.carDetailsService.getBylistingId(this.id).subscribe((response) => {
    
    this.carListing = response;
    
    });
    
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {
    
  }
  

}
