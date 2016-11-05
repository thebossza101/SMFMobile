import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar, SQLite, Push } from 'ionic-native';
//import { Storage } from '@ionic/storage';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';

import { SafeHttp } from '../providers/safe-http';
@Component({
  template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild('myNav') nav: NavController
  rootPage: any;
  platform: any
  database: SQLite;
  people: Array<Object>;
  tokenid: any;
  //sql: Storage;
  constructor(platform: Platform, public safeHttp: SafeHttp, public events: Events) {
    this.platform = platform
    this.initialfunction();
  }
  initialfunction() {
    this.platform.ready().then(() => {
      this.push().then(() => this.createDB());



      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
  push() {
    let push = Push.init({
      android: {
        senderID: "493836334159"
      },
      ios: {
        alert: "true",
        badge: true,
        sound: 'false'
      },
      windows: {}
    });
    Push.hasPermission().then((data) => {
      if (data.isEnabled) {
        console.log('isEnabled');
      }
    })
    push.on("registration", (data) => {
      //console.log(data.registrationId);
      this.tokenid = data.registrationId;
      this.checklogin()
    })
    push.on('notification', (data) => {
      console.log(data.message);
      console.log(data.title);
      console.log(data.count);
      console.log(data.sound);
      console.log(data.image);
      console.log(data.additionalData);
      this.events.publish("pushnotification");

    });
    push.on('error', (e) => {
      console.log(e.message);
    });
    return Promise.resolve(true);
  }

  createDB() {
    let db = new SQLite();
    db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Acc (USERNAME TEXT, STATUSLOGIN INT,tokenid TEXT)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS Table1 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS Table2 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS Table3 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS Table4 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS MBDATA (id INTEGER PRIMARY KEY AUTOINCREMENT,DOCTYPE TEXT, DOCNO TEXT, DOCSTAT TEXT,DOCDATE DATETIME)', {})
      db.executeSql('CREATE TABLE IF NOT EXISTS LOG_VERSIONS (TABLES TEXT, VERSION INT)', {}).then(() => {
        db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table1'", {}).then((data) => {
          //  console.log(data)
          if (data.rows.length <= 0) {
            db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table1','0')", {})

          }

        })
        db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'All'", {}).then((data) => {
          //  console.log(data)
          if (data.rows.length <= 0) {
            db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('All','0')", {})

          }

        })
        db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table2'", {}).then((data) => {
          //  console.log(data)
          if (data.rows.length <= 0) {
            db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table2','0')", {})
          }

        })
        db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table3'", {}).then((data) => {
          //  console.log(data)
          if (data.rows.length <= 0) {
            db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table3','0')", {})
          }

        })
        db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table4'", {}).then((data) => {
          //  console.log(data)
          if (data.rows.length <= 0) {
            db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table4','0')", {})
          }

        })
      })


      return Promise.resolve(true);

    }, (error) => {
      console.error("Unable to open database", error);
    });
  }
  checklogin() {
    let db = new SQLite();
    db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      db.executeSql("SELECT * FROM Acc WHERE STATUSLOGIN = '1'", {}).then((data) => {
        if (data.rows.length > 0) {
          let data2 = data.rows.item(0)
          //console.log(data2.USERNAME);
          this.saveonlinetoken(this.tokenid, data2.USERNAME);
          this.rootPage = MenuPage;

        } else {
          console.log(this.tokenid);
          this.nav.setRoot(LoginPage, { tokenid: this.tokenid })

        }
      })

    })
  }
  saveonlinetoken(tokenid, username) {
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "SELECT * FROM MBACCOUNT WHERE IDTOKEN = '" + tokenid + "'";
    let data = {
      sql,
      mode: '1'
    }
    this.safeHttp.newpostdata(url, data).then((res) => {
      if (!res[0]) {
        let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
        let sql = "INSERT INTO MBACCOUNT (USERNAME,IDTOKEN) VALUES ('" + username + "','" + tokenid + "');";
        let data = {
          sql,
          mode: '2'
        }
        this.safeHttp.newpostdata(url, data)
      }
    })
  }

}
