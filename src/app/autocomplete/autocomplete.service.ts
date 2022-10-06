import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(
    private http: HttpClient
  ) { }

  getAutocompleteList(): Observable<any> {
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

  deleteAutocomplete(id: number): Observable<any> {
    return this.http.post('https://api.maid-cafe.ch/?mode=removeAutocomplete', { id }, { observe: 'response' }).pipe(
      map((response: any) => {
        // console.log(response);
        if (response !== null) {
          return response;
        }
      }), catchError((err: any) => {
        // console.log(error);
        return err(err);
      })
    );
  }
}
