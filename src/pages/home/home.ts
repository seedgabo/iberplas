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

  orderAdmin() {
    this.navCtrl.push("ProductosPage");
  }

  orderSpecial() {
    this.api.storage.get(new Date().toDateString() + "-pedido").then((pedido) => {
      console.log(pedido);
      if (pedido) {
        this.alert
          .create({
            title: "Pedido ya ordenado",
            buttons: ["Ok"]
          })
          .present();
        return;
      }
      this.alert
        .create({
          title: "Ordenar Menu Especial",
          buttons: [
            {
              text: "no",
              handler: () => {}
            },
            {
              text: "Si",
              handler: () => {
                this.PostOrderSpecial();
              }
            }
          ]
        })
        .present();
    });
  }

  PostOrderSpecial() {
    this.api
      .post("pedidos", {
        fecha_pedido: new Date(),
        tipo: "comida",
        items: [
          {
            name: "precio",
            referencia: "especial",
            precio: 1,
            producto_id: "17655",
            cantidad_pedidos: 1
          }
        ],
        user_id: this.api.user.id,
        entidad_id: this.api.user.entidad_id
      })
      .then((data) => {
        this.api.storage.set(new Date().toDateString() + "-pedido", data);
        console.log(data);
        this.alert
          .create({
            title: "Pedido Realizado",
            buttons: ["Ok"]
          })
          .present();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
