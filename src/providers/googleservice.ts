import { Injectable } from '@angular/core';
import { Http,  Headers } from '@angular/http';
import { InAppBrowser } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the Googleservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Googleservice {

  constructor(public http: Http) {
    console.log('Hello Googleservice Provider');
  }
  handleAuthClick() {
    let googleurl = 'https://accounts.google.com/o/oauth2/v2/auth';
    let response_type = 'token';
    let client_id = '52574457821-r1sf87jeu491jvj6r10re0lp83httmqv.apps.googleusercontent.com';
    let redirect_uri = 'http://localhost/callback';
    let SCOPES = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
      'https://www.googleapis.com/auth/drive.photos.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.scripts',
      'https://www.googleapis.com/auth/drive'
    ];
    let scope = SCOPES.join('+');
    let prompt = 'consent';
    let url = googleurl + '?'
    url += 'response_type=' + response_type + '&'
    url += 'client_id=' + client_id + '&'
    url += 'redirect_uri=' + redirect_uri + '&'
    url += 'scope=' + scope + '&'
    url += 'prompt=' + prompt
    let target = '_blank'
    let options = 'location=no'
    let ref = new InAppBrowser(url, target, options);
    return new Promise(resolve => {
      ref.on('loadstart').subscribe((res) => {
        if ((res.url).indexOf("http://localhost/callback") === 0) {
          ref.on('exit')
          //console.log(res);
          let access_token = (res.url).split("access_token=")[1]
          access_token = (access_token).split("&token_type=")[0]
          resolve(access_token);
          ref.close();
          /*
          let requestToken = (res.url).split("code=")[1]
          console.log(requestToken);
          requestToken = requestToken.substring(0, requestToken.length - 1);
          ref.close();
          let link = "https://www.googleapis.com/oauth2/v4/token";
          let code = requestToken;
          let redirect_uri = 'http://localhost/callback'
          let client_secret = 'x8uMb8JLIbFeJWghlurIpNEp'
          let grant_type = 'authorization_code'
          let data = "code=" + code + "&redirect_uri=" + redirect_uri + "&client_id=" + client_id + "&client_secret=" + client_secret + "&scope=&grant_type=authorization_code"
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');

          this.http.post(link, data, {
            headers: headers
          }).map(res => res.json())
            .subscribe(
            data => {
              // console.log(data.access_token);
              resolve(data.access_token);
            },
            err => { console.log(err + 'er'); }
            );

*/

        }
      })



    });

  }
  googledriveSearchforFiles(Filesname, access_token) {
    const endpoint = "https://www.googleapis.com/drive/v3/files?q=name%3D'" + Filesname + "'&fields=files(iconLink%2Cid%2Cname%2CthumbnailLink%2CwebViewLink)";
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + access_token);
    return new Promise((resolve,reject) => {

      this.http
        .get(endpoint, {
          headers: headers
        })
        .map(res => res.json())
        .subscribe(data => {
          //console.log(data);
          resolve(data);
        },(er)=>{
          reject(er);
        });

    });//  return new Promise(resolve => {


  }



}
