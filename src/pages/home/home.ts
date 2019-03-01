import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  valueQrCode = null
  inputQrCode = null

  constructor(public navCtrl: NavController) {

  }

  generateQrCode() {
    console.log(this.inputQrCode);
    this.valueQrCode = this.inputQrCode;
  }

}
