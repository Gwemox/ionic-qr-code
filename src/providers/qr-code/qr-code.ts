import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Subscription } from 'rxjs/Subscription';

/*
  Generated class for the QrCodeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QrCodeProvider {

  private scanSub: Subscription = null;

  constructor(public http: HttpClient, private qrScanner: QRScanner) {
    console.log('Hello QrCodeProvider Provider');
  }

  generate(text: string): Promise<string> {
    //TODO: Code this
    return Promise.resolve('');
  }

  scan(callback : (value: string) => any, callbackError : (error: any) => any) {

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          this.qrScanner.show().then((qrScannerStatus: QRScannerStatus) => console.log(qrScannerStatus));
          this.qrScanner.resumePreview();
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            this.qrScanner.pausePreview(); // pause preview
            callback(text);
            this.stopScan();
            //this.qrScanner.resumePreview(); // resume preview
            //scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          throw 'Permission was denied, but not permanently.';
        }
      })
      .catch(callbackError);
  }
  

  stopScan() {
    if (this.scanSub) {
      this.scanSub.unsubscribe();
      this.scanSub = null;
    }
  }

}
