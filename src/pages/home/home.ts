import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgxQRCodeComponent } from 'ngx-qrcode2';
import { SocialSharing } from '@ionic-native/social-sharing';
import { QrCodeProvider } from '../../providers/qr-code/qr-code';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(NgxQRCodeComponent) qrCodeComponent: NgxQRCodeComponent;

  valueQrCode = null
  inputQrCode = null

  constructor(public navCtrl: NavController, private socialSharing: SocialSharing, private qrCodeProvider: QrCodeProvider) {
  }

  generateQrCode() {
    if(!this.inputQrCode) return;
    this.valueQrCode = this.inputQrCode;
    this.qrCodeProvider.add({ value: this.valueQrCode, date: new Date()})
  }

  async share() {
    if (this.qrCodeComponent) {
      let imageData = await this.qrCodeComponent.toDataURL();
      this.socialSharing.share('Flashez moi !', 'Mon QR Code', imageData.toString());
    }
  }
}
