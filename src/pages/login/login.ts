import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, LoadingController, ModalController } from "ionic-angular";
import { Api } from "../../providers/Api";
import { HomePage } from "../home/home";
import moment from "moment";
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  register = false;
  send = {
    password: "",
    password_confirmation: "",
    nombre: "",
    email: "",
    cedula: "",
    cliente_id: 1
  };
  validation = "";
  terms = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertController,
    public loading: LoadingController,
    public modal: ModalController
  ) {}

  ionViewDidLoad() {}

  doLogin() {
    var loading = this.loading.create({ content: "Iniciando Sesión" });
    loading.present();
    this.api
      .doLogin()
      .then((response: any) => {
        loading.dismiss();
        this.api.saveUser(response);
        this.api.saveData();
        this.api.user = response;
        this.navCtrl.setRoot(HomePage).then(() => {
          if (this.api.password == this.api.username) {
            this.modal.create("PasswordChangePage").present();
          }
        });
      })
      .catch(() => {
        loading.dismiss();
        this.alert.create({ title: "Error", message: "Error al iniciar sesión", buttons: ["Ok"] }).present();
      });
  }

  registrarse() {
    this.register = !this.register;
  }

  canRegister() {
    return (
      this.send.password.length > 5 &&
      this.send.email.length > 3 &&
      this.send.nombre.length > 3 &&
      this.send.password == this.send.password_confirmation &&
      this.validation == "" + moment().daysInMonth() * moment().daysInMonth() * moment().month() * moment().month() &&
      // this.terms &&
      // this.send.notas.length == 8 &&
      this.send.cedula.length > 3
    );
  }

  doRegister() {
    var loading = this.loading.create({ content: "Cargando" });
    loading.present();
    this.api
      .post("register", this.send)
      .then((data) => {
        loading.dismiss();
        console.log(data);
        this.api.username = this.send.email;
        this.api.password = this.send.password;
        this.api.user = data;
        this.api.saveUser(data);
        this.api.saveData();
        this.navCtrl.setRoot(HomePage);
      })
      .catch((err) => {
        loading.dismiss();
        console.error(err);
        this.alert
          .create({
            message: err.error + " " + err.error_message,
            title: "ERROR",
            buttons: ["OK"]
          })
          .present();
      });
  }

  forgotPassword() {
    this.alert
      .create({
        title: "Olvide mi contraseña",
        inputs: [
          {
            label: "email",
            type: "email",
            name: "email",
            placeholder: "Correo"
          }
        ],
        buttons: [
          {
            text: "Recuperar",
            handler: (data) => {
              var email = data.email;
              this.api
                .get("forgot-password?email=" + email)
                .then((data) => {
                  this.alert
                    .create({
                      title: "correo enviado",
                      subTitle: "Revise su bandeja de entrada",
                      buttons: ["OK"]
                    })
                    .present();
                })
                .catch((err) => {
                  this.alert
                    .create({
                      title: "no se pudo enviar el correo de recuperación",
                      buttons: ["OK"]
                    })
                    .present();
                });
            }
          }
        ]
      })
      .present();
  }
}
