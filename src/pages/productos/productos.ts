import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from "ionic-angular";
import { Api } from "../../providers/Api";
@IonicPage()
@Component({
  selector: "page-productos",
  templateUrl: "productos.html"
})
export class ProductosPage {
  productos: any = [];
  categorias = { null: { productos: [], show: false } };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertController,
    public loading: LoadingController,
    public api: Api
  ) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api
        .get("productos?with[]=categoria&where[active]=1&limit=150")
        .then((resp) => {
          this.prepareProducts(resp);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  increment(prod) {
    prod.cantidad_pedidos++;
  }
  decrement(prod) {
    prod.cantidad_pedidos--;
    if (prod.cantidad_pedidos < 0) {
      prod.cantidad_pedidos = 0;
    }
  }

  order() {
    this.alert
      .create({
        title: "Ordenar",
        inputs: [
          {
            placeholder: "Direccion pedido",
            name: "direccion_pedido",
            type: "text"
          }
        ],
        buttons: [
          "Cancelar",
          {
            text: "Confirmar",
            handler: (data) => {
              if (data && data.direccion_pedido) this._order(data.direccion_pedido);
            }
          }
        ]
      })
      .present();
  }

  total() {
    var sum = 0;
    this.productos.forEach((element) => {
      if (element.cantidad_pedidos) {
        sum += parseFloat(element.cantidad_pedidos) * parseFloat(element.precio);
      }
    });
    return sum;
  }

  _order(direccion_pedido) {
    var loading = this.loading.create({ content: "Creando Pedido" });
    var items = [];
    this.productos.forEach((prod) => {
      if (prod.cantidad_pedidos > 0) {
        items.push(prod);
      }
    });
    if (items.length == 0) {
      this.alert
        .create({
          title: "No Hay Productos Seleccionados",
          buttons: ["Ok"]
        })
        .present();
      return;
    }
    loading.present();
    this.api
      .post("pedidos", {
        fecha_pedido: new Date(),
        items: items,
        user_id: this.api.user.id,
        entidad_id: this.api.user.entidad_id,
        cliente_id: this.api.user.cliente_id || 1,
        direccion_envio: direccion_pedido
      })
      .then((resp) => {
        loading.dismiss();
        this.navCtrl.pop();
        this.alert.create({ title: "Pedido Realizado", buttons: ["Ok"] }).present();
      })
      .catch((error) => {
        console.error(error);
        loading.dismiss();
        this.alert.create({ title: "Error en  Pedido", buttons: ["Ok"] }).present();
      });
  }

  prepareProducts(products) {
    this.productos = products;
    this.productos.forEach((prod) => {
      prod.cantidad_pedidos = 0;

      if (!prod.categoria) {
        this.categorias.null.productos.push(prod);
      } else {
        if (!this.categorias[prod.categoria.name]) {
          this.categorias[prod.categoria.name] = { categoria: prod.categoria, productos: [], show: false };
        }
        this.categorias[prod.categoria.name].productos.push(prod);
      }
    });
  }
}
