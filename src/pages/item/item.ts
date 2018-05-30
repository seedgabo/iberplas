import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Slides, ToastController, AlertController, IonicPage } from "ionic-angular";
import { Api } from "../../providers/Api";

@IonicPage()
@Component({
  selector: "page-item",
  templateUrl: "item.html"
})
export class ItemPage {
  producto: any = {};
  @ViewChild("mySlider") slider: Slides;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public toast: ToastController,
    public alert: AlertController
  ) {
    this.producto = navParams.data.producto;
    if (this.producto.cantidad_pedidos == undefined) {
      this.producto.cantidad_pedidos = 1;
    }
    if (this.producto.data != null && !Array.isArray(this.producto.data)) {
      this.producto.data = JSON.parse(this.producto.data);
    }
  }

  ionViewDidLoad() {
    // this.getProducto();
  }

  getProducto(refresher = undefined) {
    this.api
      .get("productos/" + this.producto.id + "?with[]=image&with[]=images")
      .then((data: any) => {
        this.producto.image = data.image;
        this.producto.images = data.images;
        this.producto.image_url = data.image_url;
        if (refresher != undefined) {
          refresher.complete();
        }
        console.log(data);
      })
      .catch((err) => {
        console.error("Error al ver el producto", err);
        if (refresher != undefined) {
          refresher.complete();
        }
      });
  }

  addtoCart() {
    // if (this.producto.es_vendible_sin_stock || this.producto.stock >= this.producto.cantidad_pedidos) {
    this.toast
      .create({ message: "Producto Agregado Al Carrito", showCloseButton: true, closeButtonText: "listo", duration: 3000 })
      .present();
    this.navCtrl.pop();
    // } else {
    //   this.alert.create({ title: "Sin Stock Suficiente", buttons: ["Ok"] }).present();
    // }
  }

  goToSlide(index) {
    this.slider.slideTo(index, 500);
  }

  addPed() {
    this.producto.cantidad_pedidos++;
    // if (this.producto.cantidad_pedidos < 1) this.producto.cantidad_pedidos = 1;
    // if (!this.producto.es_vendible_sin_stock && this.producto.cantidad_pedidos > this.producto.stock)
    //   this.producto.cantidad_pedidos = this.producto.stock;
  }

  susPed() {
    this.producto.cantidad_pedidos--;
    // if (this.producto.cantidad_pedidos < 1) this.producto.cantidad_pedidos = 1;
    // if (this.producto.cantidad_pedidos > this.producto.stock) this.producto.cantidad_pedidos = this.producto.stock;
  }
}
