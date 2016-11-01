import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { SafeHttp } from '../../providers/safe-http';
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
  tokenid:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public safeHttp: SafeHttp) {
    this.tokenid = this.navParams.get('tokenid');
    console.log(this.tokenid);
  }

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
alert('โปรดใส่ password')
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
              this.sql.executeSql("INSERT INTO Acc (USERNAME,STATUSLOGIN,tokenid) VALUES ('"+username+"',1,'"+this.tokenid+"')",{});
              this.saveonlinetoken(this.tokenid,username)
              this.navCtrl.setRoot(MenuPage);
            })
  }
    saveonlinetoken(tokenid,username){
let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
let sql = "SELECT * FROM MBACCOUNT WHERE IDTOKEN = '"+ tokenid +"'";
let data = {
  sql,
  mode:'1'
} 
this.safeHttp.newpostdata(url,data).then((res)=>{
   if (!res[0]) {
     let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
let sql = "INSERT INTO MBACCOUNT (USERNAME,IDTOKEN) VALUES ('"+ username +"','"+ tokenid +"');";
let data = {
  sql,
  mode:'2'
}
this.safeHttp.newpostdata(url,data)
                  } 
})
  }

}
