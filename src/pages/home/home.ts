import { LoginPage } from "../login/login";
import { VerPedidoPage } from "../ver-pedido/ver-pedido";
import { Api } from "../../providers/Api";
import { Component } from "@angular/core";
import { ModalController, AlertController, NavController, NavParams, ToastController } from "ionic-angular";
import * as moment from "moment";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  canOrder = false;
  rand = Math.random() * 1000;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api
        .get(`users/${this.api.user.id}?with[]=roles`)
        .then((result: any) => {
          result.roles.forEach((rol) => {
            if (rol.name == "SuperAdmin") this.canOrder = true;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  orderAdmin() {
    this.navCtrl.push("ProductosPage");
  }
}
