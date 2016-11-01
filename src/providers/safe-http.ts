import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { NetworkService } from './network-service';
/*
  Generated class for the SafeHttp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SafeHttp {

  constructor(public http: Http,public networkService: NetworkService) {
//  console.log('Hello SafeHttp Provider');
  }
  public request(url: string | Request, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.request(url, options)
     }
  }


  public get(url: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.get(url, options)
    }
  }

  public post(url: string, body: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
    //  return this.http.post(url, body, options)
    }
  }

  public put(url: string, body: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.put(url, body, options)
     }
  }

  public delete(url: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.delete(url, options)
    }
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.patch(url, body, options)
    }

  }

  public head(url: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { //return this.http.head(url, options) 
    }
  }
  public postdata(url: string, data) {

      return new Promise((resolve, reject) => {
        if (this.networkService.noConnection()) {
          this.networkService.showNetworkAlert();
          reject('noNetworkConnection');
        } else {
const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        const body = new URLSearchParams();
        Object.keys(data).forEach(key => {
          body.set(key, data[key]);
        });
        this.http.post(url, body.toString(), { headers: headers })

          .map(res => res.json())

          .subscribe(data => {
            resolve(data);
          }, (er) => {
            reject('er - > postdata');
          });
  }
      });


  }
    public newpostdata(url: string, data) {

      return new Promise((resolve, reject) => {
        if (this.networkService.noConnection()) {
          this.networkService.showNetworkAlert();
          reject('noNetworkConnection');
        } else {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        this.http.post(url, JSON.stringify(data), { headers: headers }).map(res => res.json()).subscribe(data => {
            resolve(data);
          }, (er) => {
            reject('er - > postdata');
          });

  }
      });


  }


}
