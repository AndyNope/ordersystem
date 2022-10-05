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
    return this.http.post('https://api.maid-cafe.ch/?mode=setOrder', body, { observe: 'response' }).pipe(
      map((response: any) => {
        console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        console.log(error);
        return error(error);
      })
    );
  }

  getAutocomplete(): Observable<any> {
    return this.http.get('https://api.maid-cafe.ch/?mode=getAutocomplete', { observe: 'response' }).pipe(
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

  setAutocomplete(text: string): Observable<any> {
    return this.http.post('https://api.maid-cafe.ch/?mode=setAutocomplete', { text }, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response !== null) {
          return response;
        }
      }), catchError((error) => {
        console.log(error);
        return error(error);
      })
    );
  }
}
