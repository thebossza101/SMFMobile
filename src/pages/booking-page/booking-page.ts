import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the BookingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-booking-page',
  templateUrl: 'booking-page.html'
})
export class BookingPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello BookingPage Page');
  }

}
