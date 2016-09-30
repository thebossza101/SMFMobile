import { Component } from '@angular/core';
import { NavController , AlertController  } from 'ionic-angular';

import { Network,SQLite } from 'ionic-native';

/*
  Generated class for the BookingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-booking-page',
  templateUrl: 'booking-page.html'
})
export class BookingPage {
  fakeversion:any;
  fakedata:any;
  alert:any;
  checked:any;
  placeholdersearchbar:any;
  items:any;
  searchbarinput:any
  initializeData:any
  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {
    this.checked = {field1:true,field2:false,field3:false,};
    this.placeholdersearchbar = 'field1'
    this.searchbarinput = ''
    this.fakeversion = 0.0001
    this.fakedata = [
      {field1:'BAE16010275',field2:'Close',field3:'NOPPARAT'},
      {field1:'BAE16010276',field2:'Close',field3:'AKKARAWAT'},
      {field1:'BAE16010277',field2:'Close',field3:'AKKARAWAT'},
      {field1:'BAE16010278',field2:'Close',field3:'PIYACHART'},
      {field1:'BAE16010279',field2:'Close',field3:'PIYACHART'},
      {field1:'BAE16010280',field2:'Close',field3:'PIYACHART'},
      {field1:'BAE16010281',field2:'Close',field3:'PIYACHART'},
    ];
    this.inishowdata();
  }
  inishowdata(){
    let online = this.checkonline();
    if(online == true){
        this.check_version().then((res)=>{
                if(res == true){

                    this.getlocalsql().then((data)=>this.importitems(data)).then(()=>this.searchfuction())

                }else{

                    this.update_version().then(()=>this.getlocalsql()).then((data)=>{this.importitems(data)}).then(()=>this.searchfuction())
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
                  return db.executeSql("SELECT * FROM table2",{}).then((data)=>{
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
        let localversion = db.executeSql("SELECT VERSION FROM LOG_VERSIONS WHERE TABLES = 'table2'",{}).then((data)=>{
                        if (data.rows.length > 0) {
                          console.log(data.rows.item(0));
                          return data.rows.item(0).VERSION;
                        }
                      });
                      return  localversion.then((localversion)=>{
                          // get online version
                            //fakeversion this.fakeversion = 0.0001
                      let onlineversion = this.fakeversion
                      //console.log(onlineversion+':'+localversion);
                      if(localversion == onlineversion){
                      return true
                      }else{
                      return false
                      }
                        })
            })

  }
  update_version(){
  //get online SQL
  // fakedata
  let onlinedata = this.fakedata

  //insert localSQL
  let db = new SQLite()
  return  db.openDatabase({
                name: "SQLAPP.db",
                location: "default"
            }).then(()=>{
              //DELETE localSQL
              let dellocalsql = db.executeSql("DELETE FROM table2",{}).then((res)=>{
              let data = onlinedata
              return data
              });
              //INSERT
              let insertsql = dellocalsql.then((data)=>{
                data.forEach(data => {
                  var data_sql = data;
                db.executeSql("INSERT INTO table2 (field1,field2,field3) VALUES ('"+data_sql.field1+"','"+data_sql.field2+"','"+data_sql.field3+"')",{});
                });
                return true
              })
              //get online version
              let onlineversion = this.fakeversion
              //updatelocalversion
              let updatelocalversion = insertsql.then(()=>db.executeSql("UPDATE LOG_VERSIONS SET VERSION='"+onlineversion+"' WHERE TABLES='table2'",{}))
              return updatelocalversion

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
                    let dellocalsql = db.executeSql("DELETE FROM table2 WHERE field1 = '"+item.field1+"'",{})
                    dellocalsql.then(()=>this.getlocalsql()).then((data)=>this.importitems(data)).then(()=>this.searchfuction())

                  })

    }
    itemSel(item){
      //console.log(item);
      //this.navCtrl.push(DetailsPage,{data:item,config:{page:'SALE',table:'table2'}});
    }


  ionViewDidLoad() {
    console.log('Hello BOOKING Page');
  }
  ionViewDidEnter(){
    console.log('Hello BOOKING Page:ionViewDidEnter');
  }


}
