import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrders(): Observable<any> {
    return this.http.get('https://api.maidcafe-dreamgarden.ch/?mode=getOrders', { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  getOldOrders(): Observable<any> {
    return this.http.get('https://api.maidcafe-dreamgarden.ch/?mode=getOldOrders', { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  getCanceledOrders(): Observable<any> {
    return this.http.get('https://api.maidcafe-dreamgarden.ch/?mode=getCanceledOrders', { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  getNotCanceledOrders(): Observable<any> {
    return this.http.get('https://api.maidcafe-dreamgarden.ch/?mode=getNotCanceledOrders', { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=deleteOrder', { id }, { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  terminateOrder(id: number): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=terminateOrder', { id }, { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }
}
