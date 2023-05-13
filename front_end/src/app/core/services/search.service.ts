import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

export interface IPaginationResponse<T> {
    page: number;
    pageSize: number;
    records: T[];
    numRecords: number;
}

export interface ISearchCrtieria {
    region: string;
    maxMileage: number;
    maxPrice: number;
    exteriorCondition: string;
    mechanicalCondition: string;
    color: string;
    make: string;
    model: string;
}

export type SearchCriteriaRequest = Partial<ISearchCrtieria>;


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
    
    public getRecords(page: number, pageSize: number, criteria: SearchCriteriaRequest): Observable<IPaginationResponse<ICarListing>> {
        
        const url = '/api/searches';

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", page);
        queryParams = queryParams.append("pageSize", pageSize);
        for (const [k, v] of Object.entries(criteria)) {
            queryParams = queryParams.append(k, v);
        }

        return this.http.get<IPaginationResponse<ICarListing>>(url,{params:queryParams});
    }
}