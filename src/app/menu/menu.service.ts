import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient
  ) { }

  getMenuList(): Observable<any> {
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

  deleteMenu(id: number): Observable<any> {
    return this.http.post('https://api.maidcafe-dreamgarden.ch/?mode=removeMenu', { id }, { observe: 'response' }).pipe(
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
