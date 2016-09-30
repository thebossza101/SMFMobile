import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the RECEIPTPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-receipt-page',
  templateUrl: 'receipt-page.html'
})
export class RECEIPTPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello RECEIPTPage Page');
  }

}
