import { Component } from '@angular/core';
import { NavController, AlertController ,LoadingController } from 'ionic-angular';
import { Network,SQLite } from 'ionic-native';

import { SafeHttp } from '../../providers/safe-http';

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
  fakeversion:any;
  fakedata:any;
  alert:any;
  checked:any;
  placeholdersearchbar:any;
  items:any;
  searchbarinput:any
  initializeData:any
  localversion:any
  onlineversion:any
  loading:any
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public safeHttp: SafeHttp,public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
    this.checked = {field1:true,field2:false,field3:false,};
    this.placeholdersearchbar = 'field1'
    this.searchbarinput = ''
    this.fakeversion = 0.0001
    this.fakedata = [
      {field1:'QAE12020003',field2:'Open',field3:'ADMIN'},
      {field1:'QAE12070001',field2:'Open',field3:'NAWAPORN'},
      {field1:'QAE12080001',field2:'Open',field3:'NAWAPORN'},
      {field1:'QAE15020001',field2:'Open',field3:'NAWAPORN'},
      {field1:'QAE15060001',field2:'Open',field3:'NAWAPORN'},
      {field1:'QAE16060001',field2:'Open',field3:'AKKARAWAT'},
      {field1:'QSE14120001',field2:'Open',field3:'NAWAPORN'},
    ];
    this.inishowdata();
  }
  inishowdata(){
    let online = this.checkonline();
    if(online == true){
        this.check_version().then((res)=>{
                if(res == '='){

                    this.getlocalsql().then((data)=>this.importitems(data)).then(()=>this.searchfuction())

                }else{
                    this.loading.present();
                    this.update_version().then(()=>this.getlocalsql()).then((data)=>{this.importitems(data)}).then(()=>{this.searchfuction();this.loading.dismiss();})
                }
        });

    }else{

  this.getlocalsql().then((data)=>this.importitems(data)).then(()=>this.searchfuction())

    }

  }
  checkonline(){
    // true online
    // false offline
    if(Network.connection != 'none'){
          //console.log('online')
          return true
    }else{
          //console.log('offline')
          return false
    }
  }
  getlocalsql(){
      let db = new SQLite()
      return db.openDatabase({
                    name: "SQLAPP.db",
                    location: "default"
                }).then(() => {
                  return db.executeSql("SELECT * FROM Table1",{}).then((data)=>{
                            if (data.rows.length > 0) {
                                   var newitems = [];
                              //console.log(data.res.rows)
                              for (let i = 0; i < data.rows.length; i++) {
                              newitems.push(data.rows.item(i));
                              }
                              //console.log(newitems)
                              this.initializeData = newitems
                              return newitems;

                            }
                              });
                });


  }
  importitems(data){
    //console.log(data)
    this.items = data;
  }
  searchfuction(){
    let val = this.searchbarinput

  if (val && val.trim() != ''){
    this.items = this.initializeData.filter((item) => {
      let field1:any = false
      let field2:any = false
      let field3:any = false
      if(this.checked.field1){
        field1 =  item.field1.toLowerCase().indexOf(val.toLowerCase()) > -1
      }
      if(this.checked.field2){
        field2 =  item.field2.toLowerCase().indexOf(val.toLowerCase()) > -1
      }
      if(this.checked.field3){
        field3 =  item.field3.toLowerCase().indexOf(val.toLowerCase()) > -1
      }
            return (field1 || field2 || field3);
          })
  }else{
  this.items = this.initializeData

  }
  }
  check_version(){
  // get local version
  let db = new SQLite()
  return db.openDatabase({
                name: "SQLAPP.db",
                location: "default"
            }).then(() => {
        let localversion = db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'Table1'",{}).then((data)=>{
                        if (data.rows.length > 0) {
                          console.log(data.rows.item(0));
                          this.localversion = data.rows.item(0).VERSION;
                          return data.rows.item(0).VERSION;
                        }
                      });
                      return  localversion.then((localversion)=>{
                          // get online version
                            //fakeversion this.fakeversion = 0.0001
let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
let sql = "SELECT VERSION FROM MBLOGVERSION WHERE TABLENAME = 'SALE'";
let data = {
  sql,
  mode:'1'
}
return this.safeHttp.newpostdata(url,data).then((res)=>{

 // console.log(res);

                      //let onlineversion = this.fakeversion
                      this.onlineversion= res[0]['VERSION']
                      let onlineversion = res[0]['VERSION']
                      //console.log(onlineversion+':'+localversion);
                      if(localversion == onlineversion){
                      return '='
                      } else{
                        if(localversion == 0){
                          return '0'
                        }
                      return '!='
                      }
})
                        })
            })

  }
  update_version(){
   
  
let url = 'http://072serv.com/etracking/index.php/moblieAPI/qrysql';
let sql = "SELECT DOCNO,DOCSTAT,DOCDATE FROM MBDATA WHERE DOCTYPE = 'SALE'";
let data = {
  sql,
  mode:'1'
}
return this.safeHttp.newpostdata(url,data).then((res:any)=>{
//console.log(res);


  //get online SQL
  // fakedata
  //let onlinedata = this.fakedata

  let onlinedata = res;
  //insert localSQL
  let db = new SQLite()
  return  db.openDatabase({
                name: "SQLAPP.db",
                location: "default"
            }).then(()=>{
              //DELETE localSQL
              let dellocalsql = db.executeSql("DELETE FROM Table1",{}).then((res)=>{
              let data = onlinedata
              return data
              });
              //INSERT
              let insertsql = dellocalsql.then((data)=>{
                data.forEach(data => {
                  var data_sql = data;
                db.executeSql("INSERT INTO Table1 (field1,field2,field3) VALUES ('"+data_sql.DOCNO+"','"+data_sql.DOCSTAT+"','"+data_sql.DOCDATE+"')",{});
                });
                return true
              })
              //get online version
              //let onlineversion = this.fakeversion
              let onlineversion = this.onlineversion
              //updatelocalversion
              let updatelocalversion = insertsql.then(()=>db.executeSql("UPDATE LOG_VERSIONS SET VERSION='"+onlineversion+"' WHERE TABLES='Table1'",{}))
              return updatelocalversion

            })
})
  }




    ////////////////////////////////////////////////////////////////////////////
    showCheckbox() {
      let alert = this.alertCtrl.create();
      alert.setTitle('Search field name');

      alert.addInput({
        type: 'checkbox',
        label: 'field1',
        value: 'field1',
        checked:  this.checked['field1']
      });
      alert.addInput({
        type: 'checkbox',
        label: 'field2',
        value: 'field2',
        checked: this.checked['field2']
      });
      alert.addInput({
        type: 'checkbox',
        label: 'field3',
        value: 'field3',
        checked: this.checked['field3']
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: data => {
          this.checked = {field1:false,field2:false,field3:false};
          this.placeholdersearchbar = '';
          data.forEach(data => {
              this.checked[data] = true
              this.placeholdersearchbar = this.placeholdersearchbar + ' '+data ;
          });
        }
      });
      alert.present();
    }
    itemDel(item){
        // del online SQL
        // update onlineversion
        // push notification
        //
        let db = new SQLite()
        db.openDatabase({
                      name: "SQLAPP.db",
                      location: "default"
                  }).then(()=>{
                    //DELETE localSQL
                    let dellocalsql = db.executeSql("DELETE FROM Table1 WHERE field1 = '"+item.field1+"'",{})
                    dellocalsql.then(()=>this.getlocalsql()).then((data)=>this.importitems(data)).then(()=>this.searchfuction())

                  })

    }
    itemSel(item){
      //console.log(item);
      //this.navCtrl.push(DetailsPage,{data:item,config:{page:'SALE',table:'TABLE1'}});
    }


  ionViewDidLoad() {
    console.log('Hello SalePage Page');
  }
  ionViewDidEnter(){
    console.log('Hello SalePage Page:ionViewDidEnter');
  }


}
