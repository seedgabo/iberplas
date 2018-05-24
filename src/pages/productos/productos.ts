import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from "ionic-angular";
import { Api } from "../../providers/Api";
import moment from "moment";
@IonicPage()
@Component({
  selector: "page-productos",
  templateUrl: "productos.html"
})
export class ProductosPage {
  productos: any = [];
  entidades: any = [];
  categorias = { "no categorizado": { productos: [], show: false } };
  ready = false;
  query = "";
  entidad_id = null;
  fecha_entrega = moment()
    .local()
    .add(3, "hour")
    .format("YYYY-MM-DD HH:mm");
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
        .get("productos?with[]=categoria.image&where[active]=1&limit=150")
        .then((resp) => {
          this.productos = resp;
          this.filter();
        })
        .catch((err) => {
          this.alert
            .create({
              message: JSON.stringify(err)
            })
            .present();
          console.error(err);
        });

      this.api
        .get("entidades")
        .then((resp) => {
          this.entidades = resp;
        })
        .catch(console.error);
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
    var dir = "";
    var ent = this.entidades.find((ent) => {
      return ent.id == this.entidad_id;
    });
    if (ent) {
      dir = ent.full_name;
    }

    this._order(dir);
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
        entidad_id: this.entidad_id,
        user_id: this.api.user.id,
        cliente_id: this.api.user.cliente_id || 1,
        direccion_envio: direccion_pedido,
        fecha_entrega: moment(this.fecha_entrega)
          .local()
          .format("YYYY-MM-DD HH:mm:ss")
      })
      .then((resp) => {
        loading.dismiss();
        this.navCtrl.pop();
        this.sendEmail(resp, items);
        this.alert.create({ title: "Pedido Realizado", buttons: ["Ok"] }).present();
      })
      .catch((error) => {
        console.error(error);
        loading.dismiss();
        this.alert.create({ title: "Error en  Pedido", buttons: ["Ok"] }).present();
      });
  }

  filter() {
    this.ready = false;
    this.categorias = { "no categorizado": { productos: [], show: false } };
    var f = this.query.toLowerCase();
    this.productos.forEach((prod) => {
      prod.cantidad_pedidos = 0;
      if (
        f.length == 0 ||
        (prod.name.toLowerCase().indexOf(f) > -1 || (prod.description && prod.description.toLowerCase().indexOf(f) > -1))
      ) {
        if (!prod.categoria) {
          this.categorias["no categorizado"].productos.push(prod);
        } else {
          if (!this.categorias[prod.categoria.nombre]) {
            this.categorias[prod.categoria.nombre] = { categoria: prod.categoria, productos: [], show: false };
          }
          this.categorias[prod.categoria.nombre].productos.push(prod);
        }
      }
    });
    setTimeout(() => {
      this.ready = true;
    }, 300);
  }

  canOrder() {
    return this.entidad_id && this.total() > 0;
  }

  sendEmail(resp, items) {
    var html = `
      Nuevo  Pedido \n:
      Pedido # ${resp.numero_pedido} \n
      Usuario: ${this.api.user.name} ${this.api.user.email} \n
      Fecha Pedido: ${moment(resp.fecha_pedido).format("LLL")} \n
      Fecha Entrega: ${moment(resp.fecha_entrega).format("LLL")} \n
      Direccion Entrega: ${resp.direccion_envio} \n
      Items: \n
    `;
    items.forEach((element) => {
      html += `${element.name} | Precio: ${element.precio} | Cant: ${element.cantidad_pedidos} | <br>`;
    });
    this.api
      .post(`test/email`, {
        body: html
      })
      .then((resp) => {
        this.alert.create({ title: "Correo Enviado", buttons: ["Ok"] }).present();
      })
      .catch(console.error);
  }
}
