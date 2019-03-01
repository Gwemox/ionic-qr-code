import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Subscription } from 'rxjs/Subscription';
import { Storage } from '@ionic/storage';
import { History } from './history';
import jsqrcode from 'jsqrcode/src/qrcode';

const KEY_STORAGE = "history_qr_code";
/*
  Generated class for the QrCodeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QrCodeProvider {
  private scanSub: Subscription = null;
  private camera: number = 0;

  constructor(public http: HttpClient, private qrScanner: QRScanner, private storage: Storage) {
    console.log('Hello QrCodeProvider Provider');
  }

  decodeFromFile(file: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      var image = new Image()
      let qrReader: jsqrcode = new jsqrcode();
      image.onload = () => {
        try{
          resolve(qrReader.decode(image));
        }catch(e){
          reject(e);
        }
      }
      image.src = (await this.readFileAsync(file)).toString();
    });
  }

  private readFileAsync(file: File): Promise<string|ArrayBuffer> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(file);
    })
  }

  scan(callback : (value: string) => any, callbackError : (error: any) => any) {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          this.qrScanner.useCamera(this.camera);
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
  
  turnOnFlash() {
    this.qrScanner.enableLight();
  }

  turnOffFlash() {
    this.qrScanner.disableLight();
  }

  reverseCamera() {
    if (this.camera === 0) {
      this.camera = 1;
    } else {
      this.camera = 0;
    }
    this.qrScanner.useCamera(this.camera);
  }

  stopScan() {
    if (this.scanSub) {
      this.scanSub.unsubscribe();
      this.scanSub = null;
    }
  }

  private async getStorage() : Promise<LocalForage> {
    return await this.storage.ready();
  }

  async getAll(): Promise<Array<History>> {
    let storage = await this.getStorage();
    let result = await storage.getItem<History[]>(KEY_STORAGE);
    if (!result) {
      result = [];
    }
    return result;
  }

  async add(item: History): Promise<void> {
    let storage = await this.getStorage();
    let hist = await this.getAll();
    if (hist.indexOf(item) > - 1) {
      return;
    }
    hist.push(item);
    await storage.setItem(KEY_STORAGE, hist);
    return;
  }

  async remove(item: History):Promise<void> {
    let storage = await this.getStorage();
    let hist = await this.getAll();
    let index = hist.indexOf(item);
    if (index >= - 1) {
      hist.splice(index, 1);
    }
    await storage.setItem(KEY_STORAGE, hist);
    return;
  }

  async count() {
    return (await this.getAll()).length
  }

}
