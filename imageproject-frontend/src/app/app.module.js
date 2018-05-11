var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule } from "@angular/common/http";
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
            ],
            imports: [
                BrowserModule,
                HttpClientModule,
                IonicModule.forRoot(MyApp, {
                    tabsHideOnSubPages: true,
                    tabsLayout: 'icon-left',
                    preloadModules: true
                }),
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
            ],
            providers: [
                StatusBar,
                SplashScreen,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                EmojiProvider
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map