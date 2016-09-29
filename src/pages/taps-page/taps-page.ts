import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AccountPage } from '../account-page/account-page';
import { BLPage } from '../bl-page/bl-page';
import { BookingPage } from '../booking-page/booking-page';
import { SalePage } from '../sale-page/sale-page';
/*
  Generated class for the TapsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-taps-page',
  templateUrl: 'taps-page.html'
})
export class TapsPage {
  selectedIndex:any;
  tab1:any;
  tab2:any;
  tab3:any;
  tab4:any;
  Badgetab1:any;
  Badgetab2:any;
  Badgetab3:any;
  Badgetab4:any;
  constructor(public navCtrl: NavController) {
    this.tab1 = SalePage;
    this.tab2 = BookingPage;
    this.tab3 = BLPage;
    this.tab4 = AccountPage;
    this.selectedIndex = '0';
    this.Badgetab1 ='1'
    this.Badgetab2 =''
    this.Badgetab3 =''
    this.Badgetab4 =''
  }

  ionViewDidLoad() {
    console.log('Hello TapsPage Page');
  }

}
