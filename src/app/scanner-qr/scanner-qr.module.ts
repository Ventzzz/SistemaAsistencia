import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerQrPageRoutingModule } from './scanner-qr-routing.module';

import { ScannerQrPage } from './scanner-qr.page';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerQrPageRoutingModule,
    QrCodeModule
  ],
  declarations: [ScannerQrPage, BarcodeScanningModalComponent]
})
export class ScannerQrPageModule {}
