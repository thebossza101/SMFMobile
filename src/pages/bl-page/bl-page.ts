import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the BLPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bl-page',
  templateUrl: 'bl-page.html'
})
export class BLPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello BLPage Page');
  }

}
