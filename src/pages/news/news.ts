import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Googleservice } from '../../providers/googleservice';
import { SafeHttp } from '../../providers/safe-http';
import { InAppBrowser } from 'ionic-native';

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
  items: any;
  constructor(public navCtrl: NavController, public safeHttp: SafeHttp, public googleservice: Googleservice, public storage: Storage) {
    this.getNews();
  }


  getNews() {
    this.storage.get('USERNAME').then((USERNAME)=>{
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT MBPUSHMSG.* FROM MBPUSHMSG INNER JOIN MBUSERMSG ON MBPUSHMSG.MSGID = MBUSERMSG.MSGID WHERE MBUSERMSG.USERNAME = '"+USERNAME+"' ORDER BY MBPUSHMSG.MSGID DESC"
    let data = {
      sql,
      mode: '1'
    }
    this.safeHttp.newpostdata(url, data).then((res: any) => {
      this.items = res;
    })
    })
  }

  viewLINK(LINK, TYPELINK) {
    if (TYPELINK == 'PDF') {
      this.storage.get('access_token').then((res_access_token) => {
        this.googleservice.googledriveSearchforFiles(LINK, res_access_token).then((res) => {
          console.log(res);
          this.openlink(res['files'][0]['webViewLink'])
        }).catch(() => {
          this.googleservice.handleAuthClick().then((access_token) => {
            this.storage.set('access_token', access_token);
            this.googleservice.googledriveSearchforFiles(LINK, access_token).then((res) => {
              console.log(res);
              this.openlink(res['files'][0]['webViewLink'])
            })
          })
        })
      });
    }else{
   this.openlink(LINK) 
}
  }

openlink(link){
     let target = '_blank'
  let options = 'location=no'
  new InAppBrowser(link, target, options);
}
  ionViewDidLoad() {
    console.log('Hello News Page');
  }


}
