import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(this.platform.is('capacitor')){
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then(); 
      BarcodeScanner.removeAllListeners();  
    }
  }


  async StarScan() {
    const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass : 'barcode-scanning-modal',
    showBackdrop: false,
    componentProps: { 
      formats: [],
      LensFacing: LensFacing.Back
     }
    });
  
    await modal.present();

    const {data} = await modal.onWillDismiss();
    
    if(data){
      this.scanResult = data?.barcode?.displayValue;
    }
  }

  // pa convertir un elemento html a canva y luego a img
  captureScreen(){
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas:HTMLCanvasElement) => {

      this.downLoudImage(canvas);

      if(this.platform.is('capacitor')) this.shareImage(canvas);
      else this.downLoudImage(canvas);

    })

  }


  // descargar img solo pa web  
  downLoudImage(canvas:HTMLCanvasElement){
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr.png';
    link.click();
  }

    // Compartir img pa movile  
    async shareImage(canvas:HTMLCanvasElement){
      let base64 = canvas.toDataURL();
      let path = 'qr.png';

      const loading = await this.loadingController.create({spinner: 'crescent'});

      await loading.present();

      await Filesystem.writeFile({
        path,
        data: base64,
        directory: Directory.Cache
      }).then(async(res) =>{

        let uri =  res.uri;

        await Share.share({url: uri});

        await Filesystem.deleteFile({
          path,
          directory:Directory.Cache
        })

    }).finally(() =>{
      loading.dismiss();
    })
  }
}