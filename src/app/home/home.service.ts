import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
  ) { }

  setOrder(body: any): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=setOrder', body, { observe: 'response' }).pipe(
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

  editOrder(body: any, id: number): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=editOrder', { json: body, id }, { observe: 'response' }).pipe(
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

  getMenu(): Observable<any> {
    return this.http.get('https://api.maidcafe-dreamgarden.ch/?mode=getMenus', { observe: 'response' }).pipe(
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

  setMenu(text: string): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=addMenu', { text }, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        // console.log(error);
        return error(error);
      })
    );
  }

  removeMenu(id: number): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=removeMenu', { id }, { observe: 'response' }).pipe(
      map((response: any) => {
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
