import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SafeHttp } from '../../providers/safe-http';
/*
  Generated class for the News page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class News {
items:any;
  constructor(public navCtrl: NavController,public safeHttp: SafeHttp) {
    this.getNews();
  }


getNews(){
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT * FROM MBPUSHMSG"
    let data = {
      sql,
      mode: '1'
    }
    this.safeHttp.newpostdata(url, data).then((res:any)=>{
this.items = res;
    })
}

  ionViewDidLoad() {
    console.log('Hello News Page');
  }


}
