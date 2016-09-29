import { Component,ViewChild } from '@angular/core';
import { NavController,Nav ,MenuController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { LoginPage } from '../login/login';
import { TapsPage } from '../taps-page/taps-page';
/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
@ViewChild(Nav) nav: Nav;
pages: Array<{ title: string, component: any }>;
rootPage: any = TapsPage;
  constructor(public navCtrl: NavController) {
    this.pages = [
      { title: 'Browsedata', component: TapsPage },
    //  { title: 'Page dos', component: '' },
    ];
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout() {
      let storage = new SQLite()
      storage.openDatabase({name: "SQLAPP.db",location: "default"}).then(()=>{
        storage.executeSql("DELETE FROM Acc",{});
          storage.executeSql("DELETE FROM Table1",{});
          storage.executeSql("UPDATE LOG_VERSIONS SET VERSION='0' WHERE TABLES='Table1'",{});
          storage.executeSql("UPDATE LOG_VERSIONS SET VERSION='0' WHERE TABLES='Table2'",{});
          storage.executeSql("UPDATE LOG_VERSIONS SET VERSION='0' WHERE TABLES='Table3'",{});
          storage.executeSql("UPDATE LOG_VERSIONS SET VERSION='0' WHERE TABLES='Table4'",{});
      });

      this.nav.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('Hello Menu Page');
  }

}
