import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';

import { AccountPage } from '../account-page/account-page';
import { BLPage } from '../bl-page/bl-page';
import { BookingPage } from '../booking-page/booking-page';
import { SalePage } from '../sale-page/sale-page';

import { Network, SQLite } from 'ionic-native';
import { SafeHttp } from '../../providers/safe-http';
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
  selectedIndex: any;
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  Badgetab1: any;
  Badgetab2: any;
  Badgetab3: any;
  Badgetab4: any;
  DOCTYPE: string;
  loading: any;
  localversion: any;
  private _pushnotification: () => void;
  constructor(public navCtrl: NavController, public safeHttp: SafeHttp, public loadingCtrl: LoadingController, public events: Events, public _zone: NgZone) {
     this._pushnotification = () => {
    this.pushnotification();
  };
    this.loading = this.loadingCtrl.create({
      content: 'Syncing Online Data,Please wait...'
    });
    this.eventsubscribe();
    this.checkonline()
    this.tab1 = SalePage;
    this.tab2 = BookingPage;
    this.tab3 = BLPage;
    this.tab4 = AccountPage;
    this.selectedIndex = '0';
    this.Badgetab1 = '';
    this.Badgetab2 = '';
    this.Badgetab3 = '';
    this.Badgetab4 = '';

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
      return db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'All'", {}).then((data) => {
        // if (data.rows.length > 0) {
        //console.log(data.rows.item(0));
        let localversion = data.rows.item(0).VERSION;
        this.localversion = localversion;
        // console.log(localversion);
        if (localversion == '0') {
          this.loading.present();
          return this.getinionlinedata().then(() => { this.loading.dismissAll(); })
        } else {

          return this.getonlinedata()
        }


        // } if (data.rows.length > 0)
      });

    })

  }
  getonlinedata() {
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT MBDATA.* FROM MBDATA INNER JOIN MBLOGTABLE ON MBDATA.DOCNO = MBLOGTABLE.DOCNO WHERE PMKEY > '" + this.localversion + "' GROUP BY MBDATA.DOCNO,MBDATA.DOCTYPE,MBDATA.DOCSTAT,MBDATA.DOCDATE";
    let data = {
      sql,
      mode: '1'
    }
    return this.safeHttp.newpostdata(url, data).then((res: any) => {
      console.log(res.length)
      if (res.length > 0) {
        return this.updatelocal(res);
      } else {
        return
      }
    })
  }
  getinionlinedata() {
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT * FROM MBDATA";
    let data = {
      sql,
      mode: '1'
    }
    return this.safeHttp.newpostdata(url, data).then((res) => {
      return this.updatelocal(res);
    })


  }
  updatelocal(datas) {
    let db = new SQLite()
    return db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      let sqlDOCNO = '';
      let sqlinsert = '';

      datas.forEach((data, i) => {
        var data2 = data
        //console.log(data2);
        let DOCDATE2 = this.datetimeformat(data2.DOCDATE);
        let DOCDATE = this.datetomssqlformat(DOCDATE2);
        if (datas[i + 1]) {
          sqlDOCNO += "'" + data2.DOCNO + "',";
          sqlinsert += "('" + data2.DOCTYPE + "','" + data2.DOCNO + "','" + data2.DOCSTAT + "','" + DOCDATE + "'),";
        } else {
          sqlDOCNO += "'" + data2.DOCNO + "'";
          sqlinsert += "('" + data2.DOCTYPE + "','" + data2.DOCNO + "','" + data2.DOCSTAT + "','" + DOCDATE + "')";
        }
      })

      let query = "DELETE FROM MBDATA WHERE DOCNO IN (" + sqlDOCNO + ")";
      // console.log(query)
      db.executeSql(query, {}).then((res) => {
        let query2 = "INSERT INTO MBDATA (DOCTYPE,DOCNO,DOCSTAT,DOCDATE) VALUES " + sqlinsert;
        //console.log(query2)
        db.executeSql(query2, {}).then((res) => {
          this.updatenotofication().then(() => this.updatelocalversion())

        }, (er) => { console.log('er INSERT'); console.log(er); })
      }, (er) => { console.log('er DELETE'); console.log(er); })
    })

  }
  datetimeformat(date) {
    let t = date.split(" ");
    let d = new Date(t[0] + " " + t[1] + " " + t[2])
    //console.log(d);
    return d;
  }
  datetomssqlformat(date) {
    let strdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    //console.log(strdate)
    return strdate

  }
  updatelocalversion() {
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT TOP 1 PMKEY AS Lastversion FROM MBLOGTABLE ORDER BY PMKEY DESC";
    let data = {
      sql,
      mode: '1'
    }
    this.safeHttp.newpostdata(url, data).then((res) => {
      // console.log(res);
      let db = new SQLite()
      db.openDatabase({
        name: "SQLAPP.db",
        location: "default"
      }).then(() => {
        db.executeSql("UPDATE LOG_VERSIONS SET VERSION='" + res[0]['Lastversion'] + "' WHERE TABLES='All'", {}).then((res) => {
        }, (er) => { console.log("UPDATE LOG_VERSIONS SET VERSION='0' WHERE TABLES='All'"); console.log(er); });
      })
    })
  }
  updatenotofication() {
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT DATA.DOCTYPE , COUNT(*) AS COUNTED FROM (SELECT MBDATA.* FROM MBDATA INNER JOIN MBLOGTABLE ON MBDATA.DOCNO = MBLOGTABLE.DOCNO WHERE PMKEY > '" + this.localversion + "' GROUP BY MBDATA.DOCNO,MBDATA.DOCTYPE,MBDATA.DOCSTAT,MBDATA.DOCDATE) AS DATA GROUP BY DATA.DOCTYPE";
    let data = {
      sql,
      mode: '1'
    }
    return this.safeHttp.newpostdata(url, data).then((res: any) => {
      res.forEach((val, i, ar) => {
       // console.log(val);
        if (val['DOCTYPE'] == 'SALE') {
          
          this.Badgetab1 = val['COUNTED']
          this.sentnotofication('SALE')
        }
        if (val['DOCTYPE'] == 'BOOKING') {
          this.Badgetab2 = val['COUNTED']
          this.sentnotofication('BOOKING')
        }
        if (val['DOCTYPE'] == 'B/L') {
          this.Badgetab3 = val['COUNTED']
          this.sentnotofication('B/L')
        }


      })

    })

  }
  sentnotofication(DOCTYPE) {

let myParam = {
        DOCTYPE: DOCTYPE
      }
      console.log('sentnotofication');
      this.events.publish("sentnotofication",myParam);

  }
  eventsubscribe() {
    this.events.subscribe("ionViewDidEnter", (object) => {
      if (object[0]['DOCTYPE'] == 'SALE') {
        this.Badgetab1 = "";
      }
      if (object[0]['DOCTYPE'] == 'BOOKING') {
        this.Badgetab2 = "";
      }
      if (object[0]['DOCTYPE'] == 'B/L') {
        this.Badgetab3 = "";
      }
      // do something with object

    });
    this.events.subscribe("pushnotification", this._pushnotification);

  }
  pushnotification(){
    this._zone.run(() => {
      this.getlocalversion();
    });

  }
  ionViewDidLoad() {
    console.log('Hello TapsPage Page');
  }

}
