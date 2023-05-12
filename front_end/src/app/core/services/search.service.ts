import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICar } from './cars.service';

export interface ICriteria {
    region: string;
}

export interface ISeller {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ICarListing {
    car: ICar;
    region: string;
    listDate: Date;
    saleDate: Date | null;
    seller: ISeller;
}

export interface ISearch {
    id: string;
    criterias: ICriteria[];
    results: ICarListing[];
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) { }

    public getByIds(ids: string[]): Observable<ISearch[]> {
        const url = '/api/searches/query';
        const body = JSON.stringify({"ids": ids});
        const httpOptions = {
            headers: new HttpHeaders({
                // 'Authorization': 'Bearer my-auth-token'
                'Content-Type': "application/json",
            })
        };
        return this.http.post<ISearch[]>(url, body, httpOptions);
    }

}