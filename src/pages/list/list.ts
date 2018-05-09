import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/Api";
import moment from "moment";

moment.lang("es-us");
@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  orders: any = [];
  rand = Math.random() * 1000;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad() {
    this.api.get("pedidos?order[created_at]=desc&where[user_id]=" + this.api.user.id).then((resp) => {
      console.log(resp);
      this.orders = resp;
    });
  }
}
