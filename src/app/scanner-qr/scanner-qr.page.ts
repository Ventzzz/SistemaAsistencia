import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.page.html',
  styleUrls: ['./scanner-qr.page.scss'],
})
export class ScannerQrPage implements OnInit {
  segment = 'scan';
  qrtext = '';
  scanResult = '';

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {

    if(this.platform.is('capacitor')){

      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();

    }

  }

  async StarScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data){
      this.scanResult = data?.barcode?.displayValue;
    }

  }

  // para leer el qr de una img y guardarlo en la variable 'scanResult'
  async readBarcodeFromImage() {
    const { files } = await FilePicker.pickImages({}); // dentro de lor corchetes va esto multiple: false pero el visual muestra error no se porque

    const path = files[0]?.path;

    if (!path) return;

    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats: [],
    });

    this.scanResult = barcodes[0].displayValue;
  }

  // pa convertir un elemento html a canva y luego a img
  captureScreen() {
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      this.downLoudImage(canvas);

      if (this.platform.is('capacitor')) this.shareImage(canvas);
      else this.downLoudImage(canvas);
    });
  }

  // descargar img solo pa web
  downLoudImage(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr.png';
    link.click();
  }

  // Compartir img pa movile
  async shareImage(canvas: HTMLCanvasElement) {
    let base64 = canvas.toDataURL();
    let path = 'qr.png';

    const loading = await this.loadingController.create({
      spinner: 'crescent',
    });

    await loading.present();

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    })
      .then(async (res) => {
        let uri = res.uri;

        await Share.share({ url: uri });

        await Filesystem.deleteFile({
          path,
          directory: Directory.Cache,
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  // para copiar en el portapapeles

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.scanResult,
    });

    const toast = await this.toastController.create({
      message: 'Copiado al portapapeles',
      duration: 1000,
      color: 'tertiary',
      icon: 'clipboard-outline',
      position: 'middle'
    });
    toast.present();
  };


  openCapacitorSite = async () => {

      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Quieres abrir realmente esta direccion URL?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: async() => {
              let url = this.scanResult;

              if(!['https://'].includes(this.scanResult)) url = 'https://' + this.scanResult; 
          
              await Browser.open({ url });
            }
          }
        ]
      });
    
      await alert.present();


    let url = this.scanResult;

    if(!['https//'].includes(this.scanResult)) url = 'https//' + this.scanResult; 

    await Browser.open({ url });
  };

  // revisa si el resultado es una URL
isUrl(){
  let regex = /\.(com|net|io|me|crypto|ai)\b/i;
  return regex.test(this.scanResult);
}

}
