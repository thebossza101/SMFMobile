import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {AlertController } from 'ionic-angular';
import {Network} from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the NetworkService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkService {
  public networkAlert: any;
  constructor(public http: Http,public alertCtrl: AlertController) {
   // console.log('Hello NetworkService Provider');
  }
  public noConnection() {
    return (Network.connection === 'none');
  }

  public showNetworkAlert() {
    let networkAlert = this.alertCtrl.create({
      title: 'No Internet Connection',
      message: 'Please check your internet connection.',
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        },
      /*   {
          text: 'Open Settings',
          handler: () => {
            networkAlert.dismiss().then(() => {
              //this.showSettings();
            })
          }
        } */
      ]
    });
    networkAlert.present(networkAlert);
  }

  private showSettings() {

      //Diagnostic.switchToWifiSettings();


  }
}
