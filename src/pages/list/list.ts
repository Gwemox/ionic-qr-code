import { QrCodeProvider } from './../../providers/qr-code/qr-code';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { History } from '../../providers/qr-code/history';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: History;
  icons: string[];
  items: Array<History>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrCodeProvider: QrCodeProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = null;

  }

  ionViewWillEnter(){
   this.refreshList();
  }

  async refreshList() {
    this.items = await this.qrCodeProvider.getAll();
  }

  itemTapped(event, item) { 
    if(item === this.selectedItem) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }
}
