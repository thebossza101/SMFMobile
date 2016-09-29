import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

//import { Login } from '../../providers/login';
//import { NetworkService } from '../../providers/network-service';
//import { SafeHttp } from '../../providers/safe-http';

import { MenuPage } from '../menu/menu';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string = 'admin';
  password:string = 'admin';
  sql: SQLite;
  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }
  loginclick(){
    let username = this.username
    let password = this.password
    if(!username){
alert('โปรดใส่ username')
return
    }
    if(!password){
alert('โปรดใส่ username')
return
    }
    //this.login.checkuser(username,password).then((data)=>{console.log(data)}).catch((er)=>{console.log(er)});
    //fake login
    this.sql = new SQLite();//เลือกฐานข้อมูล
    this.sql.openDatabase({
                name: "SQLAPP.db",
                location: "default"
            }).then(() => {
              this.sql.executeSql("DELETE FROM Acc",{})
              this.sql.executeSql("INSERT INTO Acc (USERNAME,STATUSLOGIN) VALUES ('"+username+"',1)",{});
              this.navCtrl.setRoot(MenuPage);
            })
  }

}
