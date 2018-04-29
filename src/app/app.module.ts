import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Api } from "../providers/Api";
import { LoginPage } from "../pages/login/login";
import { IonicStorageModule } from "@ionic/storage";
import { HttpModule } from "@angular/http";
import { Push } from "@ionic-native/push";
import { CodePush } from "@ionic-native/code-push";

@NgModule({
  declarations: [MyApp, HomePage, LoginPage, ListPage],
  imports: [BrowserModule, HttpModule, IonicModule.forRoot(MyApp), IonicStorageModule.forRoot()],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, LoginPage, ListPage],
  providers: [StatusBar, SplashScreen, CodePush, Push, { provide: ErrorHandler, useClass: IonicErrorHandler }, Api]
})
export class AppModule {}
