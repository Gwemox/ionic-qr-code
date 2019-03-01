import { QrCodeProvider } from './../../providers/qr-code/qr-code';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the QrScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QrScannerPage {
  result: String;
  flashOn: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrCodeProvider: QrCodeProvider, private cdRef:ChangeDetectorRef, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrScannerPage');
    this.startScan();
  }
  onResultScan = (value: String) => {
    this.result = value;
    this.cdRef.detectChanges();
  }
  onErrorScan = (error: any) => {
    console.error(error);
  }

  startScan() {
    this.result = null;
    this.cdRef.detectChanges();
    this.qrCodeProvider.scan(this.onResultScan.bind(this), this.onErrorScan.bind(this));
  }

  turnFlash() {
    if (this.flashOn) {
      this.qrCodeProvider.turnOffFlash();
    } else {
      this.qrCodeProvider.turnOnFlash();
    }
    this.flashOn = !this.flashOn;
  }

  reverseCamera() {
    this.qrCodeProvider.reverseCamera();
  }

  async uploadPicture(event) {
    const loader = this.loadingCtrl.create({
      content: "Chargement ..."
    });
    try {
      loader.present();
      this.result = await this.qrCodeProvider.decodeFromFile(event.target.files[0]);
    } catch (e) {
      alert('Impossible de lire le QR Code !');
    }
    event.target.value = '';
    loader.dismissAll();
  }

  ionViewWillLeave(){
   this.qrCodeProvider.stopScan();
  }
  
}
