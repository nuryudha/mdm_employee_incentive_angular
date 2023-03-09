import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions : Object = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  observe: 'response',
  responseType: 'json'
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  apvTwo:any;
  revTwo:any;
  urlSkeleton = environment.urlSkeleton;

  constructor(
    private http: HttpClient
  ) { }

  detailUser(endPoint: string, httpHeaders: any, catchError: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.detailUser + endPoint, httpHeaders).pipe(catchError);
  }

  employeeIncentivePost(endPoint: any, parameter: any, catchError: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.employeeIncentive + endPoint, parameter, httpOptions).pipe(catchError);
  }

  employeeIncentiveGet(endPoint: string, catchError: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.employeeIncentive + endPoint, httpOptions).pipe(catchError);
  }

  // getUserProfile(endPoint: any, parameter: any): Observable<HttpResponse<any>> {
  //   return this.http.post<any>(environment.getUserProfile + endPoint, parameter, httpOptions).pipe();
  // }

  upload(endPoint: any, parameter: any, catchError: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.upload + endPoint, parameter, httpOptions).pipe(catchError);
  }

  // login(endPoint: any, parameter: any): Observable<HttpResponse<any>> {
  //   return this.http.post<any>(environment.login + endPoint, parameter, httpOptions).pipe();
  // }
  
}
