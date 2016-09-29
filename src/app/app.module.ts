import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { TapsPage } from '../pages/taps-page/taps-page';
import { AccountPage } from '../pages/account-page/account-page';
import { BLPage } from '../pages/bl-page/bl-page';
import { BookingPage } from '../pages/booking-page/booking-page';
import { SalePage } from '../pages/sale-page/sale-page';

import { Login } from '../providers/login';
import { NetworkService } from '../providers/network-service';
import { SafeHttp } from '../providers/safe-http';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    TapsPage,
    AccountPage,
    BLPage,
    BookingPage,
    SalePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    TapsPage,
    AccountPage,
    BLPage,
    BookingPage,
    SalePage
  ],
  providers: [Login,NetworkService,SafeHttp]
})
export class AppModule {}
