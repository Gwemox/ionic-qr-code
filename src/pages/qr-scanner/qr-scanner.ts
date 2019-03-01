import { QrCodeProvider } from './../../providers/qr-code/qr-code';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrCodeProvider: QrCodeProvider, private cdRef:ChangeDetectorRef) {
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
    this.qrCodeProvider.scan(this.onResultScan.bind(this), this.onErrorScan.bind(this));
  }
  ionViewWillLeave(){
   this.qrCodeProvider.stopScan();
  }
  
}
