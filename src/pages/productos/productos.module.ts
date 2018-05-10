import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProductosPage } from "./productos";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ProductosPage],
  imports: [IonicPageModule.forChild(ProductosPage), PipesModule]
})
export class ProductosPageModule {}
