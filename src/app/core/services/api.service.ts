import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient ) { }
  
  httpRequest( url: any, payload: any, method: any ): Promise<any> {
    let headers: any = { 'Content-Type': 'application/jason' }
    if( method == 'GET' ) {
      return this.http.get( url.toString(), 
        { headers, responseType: 'text' as 'json' }
      ).toPromise()
    } else {
      return this.http.post( url, payload, 
        { headers, responseType: 'text' as 'json' } 
      ).toPromise()
    }
  }

  call( url:any, payload: any, method: any = 'GET' ) {
    return this.httpRequest( url, payload, method ).then((response)=>{
      return response
    }).catch((error)=>{
      return Promise.reject(error)
    })
  }

}