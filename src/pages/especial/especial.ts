import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from "ionic-angular";
import { Api } from "../../providers/Api";
import moment from "moment";
moment.locale("es");
@IonicPage()
@Component({
  selector: "page-especial",
  templateUrl: "especial.html"
})
export class EspecialPage {
  loading = true;
  canOrder = true;
  rand = Math.random() * 1000;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertController,
    public loader: LoadingController
  ) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api
        .get(`pedidos?where[user_id]=${this.api.user.id}&where[tipo]=especial&order[fecha_pedido]=desc&limit=1`)
        .then((data: any) => {
          if (data && data.length) {
            var fecha = moment.utc(data[0].fecha_pedido);
            if (moment().isSame(fecha, "week")) {
              this.canOrder = false;
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  orderSpecial() {
    this.api.storage.get(new Date().toDateString() + "-pedido").then((pedido) => {
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
        fecha_entrega: moment()
          .date(5)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
        tipo: "especial",
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
        this.canOrder = false;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
