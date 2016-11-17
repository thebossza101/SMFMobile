import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, InfiniteScroll, Refresher,Events,ModalController } from 'ionic-angular';
import { SQLite,InAppBrowser } from 'ionic-native';

import { SafeHttp } from '../../providers/safe-http';
import { Googleservice } from '../../providers/googleservice';
import { Storage } from '@ionic/storage';
//import { DetialPage } from '../detial/detial';

//import { DetailsPage } from '../details/details';
/*
  Generated class for the SalePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sale-page',
  templateUrl: 'sale-page.html'
})
export class SalePage {
  alert: any;
  checked: any;
  checked2: any;
  placeholdersearchbar: any;
  items: any;
  searchbarinput: any
  initializeData: any = [];
  localversion: any
  onlineversion: any
  loading: any
  DOCTYPE: string
  RowsPerPage:any
  Page:any
  access_token:any
  hidecomment:any
Commenttextarea:any
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public safeHttp: SafeHttp, public loadingCtrl: LoadingController,public events: Events,public googleservice: Googleservice,public storage: Storage,public modalCtrl: ModalController) {
    this.DOCTYPE = 'SALE';
    this.RowsPerPage = 10;
    this.Page = 1;
    this.initializeData = [];
    this.hidecomment = {};
    this.loading = this.loadingCtrl.create({
      content: 'Updated data,Please wait...'
    });
    this.checked = { DOCNO: true, DOCSTAT: false, DOCDATE: false, };
    this.checked2 = ['DOCNO']
    this.placeholdersearchbar = 'DOCNO'
    this.searchbarinput = '';
    this.inishowdata();
    this.eventsubscribe();
  }
  inishowdata() {
this.loading.present();
this.getdatalocal().then(()=>{})
  }
 
  getdatalocal() {
    let db = new SQLite()
    return db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
      let OFFSET = (this.Page*this.RowsPerPage)-this.RowsPerPage;
      let val = this.searchbarinput;
      //console.log(OFFSET);
      let sqlWHERE = "";
      if(val && val.trim() != ''){
        sqlWHERE += " AND "
        this.checked2.forEach((data,i) => {
       if(this.checked2[i+1]){
       sqlWHERE += " "+data+" LIKE '%"+val+"%' OR"
       }else{
       sqlWHERE += " "+data+" LIKE '%"+val+"%'"
        }
        });
      }
     //return db.executeSql("SELECT * FROM MBDATA WHERE DOCTYPE = '" + this.DOCTYPE +"'ORDER BY id DESC", {}).then((data) => {
       let sql = "SELECT * FROM MBDATA WHERE DOCTYPE = '" + this.DOCTYPE+"' " + sqlWHERE +" ORDER BY id DESC LIMIT "+this.RowsPerPage+" OFFSET "+OFFSET
       //console.log(sql);
       return db.executeSql(sql, {}).then((data) => {
        //console.log(data);
        if (data.rows.length > 0) {
          //this.initializeData = [];
          //this.hidecomment = {};
          //this.Commenttextarea = {}
          for (let i = 0; i < data.rows.length; i++) {
           // console.log(data.rows.item(i))
            //this.items.push(data.rows.item(i));
           let data2 = data.rows.item(i);
           //data2['DOCDATE'] = this.datetomssqlformat(data2['DOCDATE']);
           this.hidecomment[data2['DOCNO']] = false;
          // this.Commenttextarea[data2['DOCNO']] = data2['REMARK']
            this.initializeData.push(data2);
          }
        
          this.items =  this.initializeData;
          
          this.loading.dismissAll();
          return "1"
        }else{
          this.loading.dismissAll();
          return "0"
        }

      }, (er) => { console.log('er SELECT'); console.log(er);return });
    })
  }
  ////////////////////////////////////////////////////////////////////////////
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
  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Search field name');

    alert.addInput({
      type: 'checkbox',
      label: 'DOCNO',
      value: 'DOCNO',
      checked: this.checked['DOCNO']
    });
    alert.addInput({
      type: 'checkbox',
      label: 'DOCSTAT',
      value: 'DOCSTAT',
      checked: this.checked['DOCSTAT']
    });
    alert.addInput({
      type: 'checkbox',
      label: 'DOCDATE',
      value: 'DOCDATE',
      checked: this.checked['DOCDATE']
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.checked = { DOCNO: false, DOCSTAT: false, DOCDATE: false };
        this.placeholdersearchbar = '';
        this.checked2 = data;
        data.forEach(data => {
          this.checked[data] = true
          this.placeholdersearchbar = this.placeholdersearchbar + ' ' + data;
        });
      }
    });
    alert.present();
  }
  itemDel(item) {
    // del online SQL
    // update onlineversion
    // push notification

    let confirm = this.alertCtrl.create({
      title: 'DOCNO:'+item['DOCNO'],
      message: 'Do you want to delete it?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.item2Del(item['DOCNO'])
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  item2Del(DOCNO){
    let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
    let sql = "DELETE FROM MBDATA WHERE DOCNO = '"+DOCNO+"';INSERT INTO MBLOGTABLE(DOCNO,MODE)VALUES('"+DOCNO+"','D')";
    let data = {
      sql,
      mode: '2'
    }
  this.safeHttp.newpostdata(url, data).then((res) => {

let db = new SQLite()
db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
let query = "DELETE FROM MBDATA WHERE DOCNO = '"+DOCNO+"'";
db.executeSql(query, {}).then((res) => {
    this.items = this.items.filter(function(el) {
    return el.DOCNO !== DOCNO;
});
    this.initializeData = this.initializeData.filter(function(el) {
    return el.DOCNO !== DOCNO;
});
})
    })
    })

  }
  itemSel(item) {
    //console.log(item);
   //this.navCtrl.push(DetialPage,{data:item});
  // let profileModal = this.modalCtrl.create(DetialPage, { data: item });
   //profileModal.present();
if(this.hidecomment[item.DOCNO]){
this.hidecomment[item.DOCNO] = false;
}else{
this.hidecomment[item.DOCNO] = true;
}
  }
  searchfuction() {
   this.Page = 1;
    this.items = [];
this.getdatalocal()
this.initializeData = [];
this.hidecomment = {};
 let val = this.searchbarinput
    if (val && val.trim() != '') {
      this.items = this.initializeData.filter((item) => {
        let DOCNO: any = false
        let DOCSTAT: any = false
        let DOCDATE: any = false
        if (this.checked.DOCNO) {
          DOCNO = item.DOCNO.toLowerCase().indexOf(val.toLowerCase()) > -1
        }
        if (this.checked.DOCSTAT) {
          DOCSTAT = item.DOCSTAT.toLowerCase().indexOf(val.toLowerCase()) > -1
        }
        if (this.checked.DOCDATE) {
          DOCDATE = item.DOCDATE.toLowerCase().indexOf(val.toLowerCase()) > -1
        }
        return (DOCNO || DOCSTAT || DOCDATE);
      })
    } else {
      this.items = this.initializeData

    }

  }
  
  doInfinite(infiniteScroll: InfiniteScroll) {
    //console.log('Begin async operation');
    this.Page = this.Page + 1;
     //console.log(this.Page)
    this.getdatalocal().then((res)=>{
      infiniteScroll.complete()
     
      if(res == "0"){
        infiniteScroll.enable(false);
      }
    })
   

  }
  
  
  doRefresh(refresher: Refresher) {
    console.log('DOREFRESH', refresher);
    //this.Page = 1;
   // this.items = [];
     this.getdatalocal().then((res)=>{
      refresher.complete();
    })
     
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING', refresher.progress);
  }

  eventsubscribe(){
    this.events.subscribe("sentnotofication", (object) => {

      if (object[0]['DOCTYPE'] == this.DOCTYPE) {
          this.getdatalocal();
      }
  
      // do something with object

    });

  }
  viewPDF(PDF){
  this.storage.get('access_token').then((res_access_token) => {
this.googleservice.googledriveSearchforFiles(PDF, res_access_token).then((res)=>{
console.log(res);
this.openPDF(res['files'][0]['webViewLink'])
}).catch(()=>{
    this.googleservice.handleAuthClick().then((access_token)=>{
this.storage.set('access_token', access_token);
this.googleservice.googledriveSearchforFiles(PDF, access_token).then((res)=>{
console.log(res);
this.openPDF(res['files'][0]['webViewLink'])
})
  })
})
});    
  }

  openPDF(webViewLink){
     let target = '_blank'
    let options = 'location=no'
new InAppBrowser(webViewLink, target, options);
  }
  Approve(item){
      let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
      let TITLE = item.DOCNO+' : Approved';
      let MSG = item.REMARK;
      let LINK = '';
      let TYPELINK =''; 
      if(item.PDFNAME){
        LINK = item.PDFNAME;
        TYPELINK = 'PDF'
      }
     
    let sql = "UPDATE MBDATA SET STATUS = 'P',REMARK = '"+item.REMARK+"' WHERE DOCNO = '"+item.DOCNO+"';INSERT INTO MBLOGTABLE(DOCNO,MODE)VALUES('"+item.DOCNO+"','P');INSERT INTO MBPUSHMSG(TITLE,MSG,LINK,TYPELINK)VALUES('"+TITLE+"','"+MSG+"','"+LINK+"','"+TYPELINK+"');INSERT INTO MBUSERMSG(MSGID,USERNAME) SELECT TOP 1 MBPUSHMSG.MSGID , MBUSER.USERNAME  FROM MBPUSHMSG,MBUSER WHERE MBUSER.DEPT = '"+this.DOCTYPE+"' ORDER BY MBPUSHMSG.MSGID DESC";
    let data = {
      sql,
      mode: '2'
    }
  this.safeHttp.newpostdata(url, data).then((res) => {
this.pushnotification()
let db = new SQLite()
db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
let query = "UPDATE MBDATA SET STATUS = 'P', REMARK = '"+item.REMARK+"' WHERE DOCNO = '"+item.DOCNO+"'";
db.executeSql(query, {}).then((res) => {
    let index = this.items.findIndex(item2 => item2.DOCNO === item.DOCNO)
    item.STATUS = 'P';
    this.items.splice(index, 1, item);
    this.initializeData.splice(index, 1, item);

})
    })
    })
  }
changeSTATUS(STATUS){
if(STATUS == 'P'){
return 'Approved'
}else if(STATUS == 'R'){
return 'Rejected'
}else if(STATUS == 'A'){
return 'Open'
}else{
  return STATUS
}
}
  Reject(item){
 let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
      let TITLE = item.DOCNO+' : Rejected';
      let MSG = item.REMARK;
      let LINK = '';
      let TYPELINK =''; 
      if(item.PDFNAME){
        LINK = item.PDFNAME;
        TYPELINK = 'PDF'
      }
    let sql = "UPDATE MBDATA SET STATUS = 'R',REMARK = '"+item.REMARK+"' WHERE DOCNO = '"+item.DOCNO+"';INSERT INTO MBLOGTABLE(DOCNO,MODE)VALUES('"+item.DOCNO+"','R');INSERT INTO MBPUSHMSG(TITLE,MSG,LINK,TYPELINK)VALUES('"+TITLE+"','"+MSG+"','"+LINK+"','"+TYPELINK+"');INSERT INTO MBUSERMSG(MSGID,USERNAME) SELECT TOP 1 MBPUSHMSG.MSGID , MBUSER.USERNAME  FROM MBPUSHMSG,MBUSER WHERE MBUSER.DEPT = '"+this.DOCTYPE+"' ORDER BY MBPUSHMSG.MSGID DESC";  
    let data = {
      sql,
      mode: '2'
    }
  this.safeHttp.newpostdata(url, data).then((res) => {
this.pushnotification()
let db = new SQLite()
db.openDatabase({
      name: "SQLAPP.db",
      location: "default"
    }).then(() => {
let query = "UPDATE MBDATA SET STATUS = 'R', REMARK = '"+item.REMARK+"' WHERE DOCNO = '"+item.DOCNO+"'";
db.executeSql(query, {}).then((res) => {
    let index = this.items.findIndex(item2 => item2.DOCNO === item.DOCNO)
    item.STATUS = 'R';
    this.items.splice(index, 1, item);
    this.initializeData.splice(index, 1, item);

})
    })
    })
  }
  pushnotification(){
 let url = 'http://072serv.com/etracking/index.php/moblieAPI/push2';
    let data = {
      DEPT: this.DOCTYPE
    }
  this.safeHttp.newpostdata(url, data)
  }
  ionViewDidLoad() {
    console.log('Hello SalePage Page');
  }
  ionViewDidEnter() {
    console.log('Hello SalePage Page:ionViewDidEnter');
      let myParam = {
        DOCTYPE: this.DOCTYPE
      }
      this.events.publish("ionViewDidEnter",myParam);
  }


}
