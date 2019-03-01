import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgxQRCodeComponent } from 'ngx-qrcode2';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(NgxQRCodeComponent) qrCodeComponent: NgxQRCodeComponent;

  valueQrCode = null
  inputQrCode = null

  constructor(public navCtrl: NavController, private socialSharing: SocialSharing) {
  }

  generateQrCode() {
    this.valueQrCode = this.inputQrCode;
  }

  async share() {
    if (this.qrCodeComponent) {
      let imageData = await this.qrCodeComponent.toDataURL();
      this.socialSharing.share('Flashez moi !', 'Mon QR Code', imageData.toString());
    }
  }
}
