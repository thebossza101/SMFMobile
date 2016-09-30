import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar , SQLite, Push } from 'ionic-native';

//import { Storage } from '@ionic/storage';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage:any;
  platform:any
  database: SQLite;
  people: Array<Object>;
  //sql: Storage;
  constructor(platform: Platform) {
  this.platform = platform
  this.initialfunction();
  }
  initialfunction() {
    this.platform.ready().then(() => {
        this.createDB();
        this.checklogin();
        this.push();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
  push(){
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
    Push.hasPermission().then((data)=>{
      if (data.isEnabled) {
      console.log('isEnabled');
  }
    })
    push.on("registration",(data)=>{console.log(data.registrationId);})
    push.on('notification', (data)=>{
    console.log(data.message);
    console.log(data.title);
    console.log(data.count);
    console.log(data.sound);
    console.log(data.image);
    console.log(data.additionalData);
});
push.on('error', (e)=> {
console.log(e.message);
});

  }

  createDB(){
    let db = new SQLite();
    db.openDatabase({
                name: "SQLAPP.db",
                location: "default"
            }).then(() => {
                db.executeSql('CREATE TABLE IF NOT EXISTS Acc (USERNAME TEXT, STATUSLOGIN INT)',{})
                db.executeSql('CREATE TABLE IF NOT EXISTS Table1 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)',{})
                db.executeSql('CREATE TABLE IF NOT EXISTS Table2 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)',{})
                db.executeSql('CREATE TABLE IF NOT EXISTS Table3 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)',{})
                db.executeSql('CREATE TABLE IF NOT EXISTS Table4 (id INTEGER PRIMARY KEY AUTOINCREMENT,field1 TEXT, field2 TEXT, field3 TEXT)',{})
                db.executeSql('CREATE TABLE IF NOT EXISTS LOG_VERSIONS (TABLES TEXT, VERSION INT)',{}).then(()=>{
                  db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table1'",{}).then((data)=>{
                        //  console.log(data)
                          if (data.rows.length <= 0) {
                              db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table1','0')",{})
                          }

                  })
                  db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table2'",{}).then((data)=>{
                        //  console.log(data)
                          if (data.rows.length <= 0) {
                              db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table2','0')",{})
                          }

                  })
                  db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table3'",{}).then((data)=>{
                        //  console.log(data)
                          if (data.rows.length <= 0) {
                              db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table3','0')",{})
                          }

                  })
                  db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table4'",{}).then((data)=>{
                        //  console.log(data)
                          if (data.rows.length <= 0) {
                              db.executeSql("INSERT INTO LOG_VERSIONS (TABLES,VERSION) VALUES ('Table4','0')",{})
                          }

                  })
                })




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
                db.executeSql("SELECT * FROM Acc WHERE STATUSLOGIN = '1'",{}).then((data) => {
                  if (data.rows.length > 0) {
                    this.rootPage = MenuPage;
                  } else {
                    this.rootPage = LoginPage;
                  }
                })

            })
  }

}
