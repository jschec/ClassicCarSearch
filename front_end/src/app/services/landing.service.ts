import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  constructor(private http: HttpClient) { }

  public executeSearch(): void {
    const url = '/api/search';
    this.http.post(url, {}).subscribe();
  }
}
