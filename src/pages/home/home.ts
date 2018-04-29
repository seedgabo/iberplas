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
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api.user.roles.forEach((rol) => {
        if (rol.name == "SuperAdmin") this.canOrder = true;
      });
    });
  }

  orderSpecial() {
    this.alert
      .create({
        title: "Ordernar Menu Especial",
        buttons: [
          {
            text: "no",
            handler: () => {}
          },
          {
            text: "Si",
            handler: () => {}
          }
        ]
      })
      .present();
  }
}
