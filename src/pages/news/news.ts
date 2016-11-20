import { Component } from '@angular/core';
import { NavController, LoadingController, InfiniteScroll, Refresher } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Googleservice } from '../../providers/googleservice';
import { SafeHttp } from '../../providers/safe-http';
import { InAppBrowser,Network, SQLite } from 'ionic-native';

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
  localversion:any
  loading: any;
  RowsPerPage:any
  Page:any
  constructor(public navCtrl: NavController, public safeHttp: SafeHttp, public googleservice: Googleservice, public storage: Storage, public loadingCtrl: LoadingController) {
      this.items = [];
      this.Page = '1';
      this.RowsPerPage = '10';
       this.loading = this.loadingCtrl.create({
      content: 'Syncing Online Data,Please wait...'
    });
    this.checkonline()
  }
    checkonline() {
    // true online
    // false offline
    if (Network.connection != 'none') {
      // console.log('online')
      // return true

      return this.getlocalversion()
    } else {
      //console.log('offline')
      // return false

    }
  }
    getlocalversion() {
    let db = new SQLite()
    return db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      return db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'News'", {}).then((data) => {
        // if (data.rows.length > 0) {
        //console.log(data.rows.item(0));
        let localversion = data.rows.item(0).VERSION;
        this.localversion = localversion;
        // console.log(localversion);
        
        return this.getOnlineNews()

        // } if (data.rows.length > 0)
      });

    })

  }

  getOnlineNews() {
    return this.storage.get('USERNAME').then((USERNAME)=>{
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT MBPUSHMSG.*, CONVERT(VARCHAR(19),MBPUSHMSG.LOGTIME,121) AS LOGTIME2,CONVERT(VARCHAR(19),getdate(),121) AS DATENOW FROM MBPUSHMSG INNER JOIN MBUSERMSG ON MBPUSHMSG.MSGID = MBUSERMSG.MSGID WHERE MBUSERMSG.USERNAME = '"+USERNAME+"' AND MBPUSHMSG.LOGTIME > '"+this.localversion+"' ORDER BY MBPUSHMSG.MSGID DESC"
    let data = {
      sql,
      mode: '1'
    }
    return this.safeHttp.newpostdata(url, data).then((res: any) => {
        // console.log(res.length)
      if (res.length > 0) {
        return this.updatelocal(res);
      } else {
           this.Page = '1';
         return this.getlocaldata();
      }
    })
    })
  }
  updatelocal(datas){
    let db = new SQLite()
    return db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      let query1 = "UPDATE LOG_VERSIONS SET VERSION='"+datas[0]['DATENOW'] +"' WHERE TABLES='News'";
      db.executeSql(query1, {})

      let sqlinsert = '';

      datas.forEach((data, i) => {
        var data2 = data
        console.log(data2);
        //let DOCDATE2 = this.datetimeformat(data2.DOCDATE);
       // let DOCDATE = this.datetomssqlformat(DOCDATE2);
        if (datas[i + 1]) {
          sqlinsert += "('" + data2.MSGID + "','" + data2.TITLE + "','" + data2.MSG + "','" + data2.LINK + "','" + data2.TYPELINK + "','" + data2.LOGTIME2 + "'),";
        } else {
          sqlinsert += "('" + data2.MSGID + "','" + data2.TITLE + "','" + data2.MSG + "','" + data2.LINK + "','" + data2.TYPELINK + "','" + data2.LOGTIME2 + "')";
        }
      })

        let query2 = "INSERT INTO NEWS (MSGID,TITLE,MSG,LINK,TYPELINK,LOGTIME) VALUES " + sqlinsert;
        //console.log(query2)
      return  db.executeSql(query2, {}).then((res) => {
          //this.updatenotofication().then(() => this.updatelocalversion())
      this.Page = '1';
         return this.getlocaldata()
        }, (er) => { console.log('er INSERT'); console.log(er); })
   
    })
  }
getlocaldata(){
 let db = new SQLite()
    return db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
       let OFFSET = (this.Page*this.RowsPerPage)-this.RowsPerPage;
      let query1 = "SELECT * FROM NEWS ORDER BY id DESC LIMIT "+this.RowsPerPage+" OFFSET "+OFFSET;
     return db.executeSql(query1, {}).then((data) => {

   if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
           // console.log(data.rows.item(i))
            //this.items.push(data.rows.item(i));
           let data2 = data.rows.item(i);
            this.items.push(data2);
          }
          return "1"
        }else{
          return "0"
        }



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
 doInfinite(infiniteScroll: InfiniteScroll) {
    //console.log('Begin async operation');
    this.Page = this.Page + 1;
     //console.log(this.Page)
    this.getlocaldata().then((res:any)=>{
      infiniteScroll.complete()
     
      if(res == "0"){
        infiniteScroll.enable(false);
      }
    })
   

  }
  
  
  doRefresh(refresher: Refresher) {
    console.log('DOREFRESH', refresher);
    this.Page = 1;
   // this.items = [];
     this.checkonline().then((res)=>{
      refresher.complete();
    })
     
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING', refresher.progress);
  }
  ionViewDidLoad() {
    console.log('Hello News Page');
  }


}
