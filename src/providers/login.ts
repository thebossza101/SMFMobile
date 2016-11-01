import { Injectable } from '@angular/core';
import { Http,} from '@angular/http';
import 'rxjs/add/operator/map';

import { SafeHttp } from './safe-http';
/*
  Generated class for the Login provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Login {
  data: any;

  constructor(public http: Http, public safeHttp: SafeHttp) {
    this.data = null;
    // console.log('Hello Login Provider');

  }
  checkuser(user: string, pass: string) {

    let data = [{ username: user, password: pass }];
    const endpoint = 'http://www.072serv.com/etracking/index.php/testapp/get_EMPCODE_detial/';
    return this.safeHttp.postdata(endpoint, data);

  }

}
