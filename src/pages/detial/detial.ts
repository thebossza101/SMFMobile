import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

/*
  Generated class for the Detial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detial',
  templateUrl: 'detial.html'
})
export class DetialPage {
data:any
  constructor(public navCtrl: NavController,public params: NavParams) {
    this.data = this.params.get('data');
  }

  ionViewDidLoad() {
    console.log('Hello DetialPage Page');
  }

}
