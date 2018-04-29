import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { CodePush, InstallMode, SyncStatus } from "@ionic-native/code-push";

import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";
import { LoginPage } from "../pages/login/login";
import { Api } from "../providers/Api";
import moment from "moment";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusbar: StatusBar,
    public splashscreen: SplashScreen,
    public codepush: CodePush,
    public api: Api
  ) {
    this.initializeApp();
    this.pages = [{ title: "Home", component: HomePage }, { title: "Mis Pedidos", component: ListPage }];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusbar.styleDefault();
      this.splashscreen.hide();
      if (this.platform.is("android") || this.platform.is("ios")) {
        const downloadProgress = (progress) => {
          console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
        };
        this.codepush.sync({ updateDialog: false, installMode: InstallMode.ON_NEXT_RESUME }, downloadProgress).subscribe(
          (syncStatus) => {
            console.log(syncStatus);
          },
          (err) => {
            console.warn(err);
          }
        );
      }
    });
    this.api.ready.then(() => {
      if (!this.api.user) {
        this.nav.setRoot(LoginPage);
      } else {
        this.nav.setRoot(HomePage);
      }
    });
  }

  updateUser() {
    this.api
      .doLogin()
      .then((response) => {
        this.api.saveUser(response);
        this.api.saveData();
        this.api.user = response;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  logout() {
    this.api.productos = [];
    this.api.user = null;
    this.api.username = "";
    this.api.password = "";
    this.api.carrito = [];
    this.api.saveUser(null);
    this.api.storage.clear();
    this.nav.setRoot(LoginPage);
  }
}
