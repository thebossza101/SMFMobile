import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { INVOICEPage } from '../invoice-page/invoice-page';
import { RECEIPTPage } from '../receipt-page/receipt-page';
import { PAYINPage } from '../payin-page/payin-page';
/*
  Generated class for the AccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-page',
  templateUrl: 'account-page.html'
})
export class AccountPage {
  INVOICEPage:any;
  RECEIPTPage:any;
  PAYINPage:any;
  constructor(public navCtrl: NavController) {
    this.INVOICEPage = INVOICEPage;
    this.RECEIPTPage = RECEIPTPage;
    this.PAYINPage = PAYINPage;
  }

  ionViewDidLoad() {
    console.log('Hello AccountPage Page');
  }

}
