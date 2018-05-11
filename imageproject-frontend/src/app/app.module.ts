import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule } from "@angular/common/http";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";
import {ChatService} from "../providers/chat-service";

const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };


@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left',
      preloadModules: true
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    ChatService,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider
  ]
})
export class AppModule {}
