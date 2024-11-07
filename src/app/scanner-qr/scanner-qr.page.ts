import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { AuthService } from '../auth.service'; // Asegúrate de importar AuthService para obtener el rol del usuario
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
import { HttpClient } from '@angular/common/http';

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
  idClase = '';
  isAdmin: boolean = false; // Agregar propiedad isAdmin
  private apiUrl = 'https://asisduoc-api-77f03f161fc1.herokuapp.com'
  private _storage: any;

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService, // Inyectar AuthService para obtener el rol de usuario
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    // Verificar si el usuario es administrador
    const role = await this.authService.getUserRole();
    this.isAdmin = role === 'admin';

    if (this.platform.is('capacitor')) {
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
        lensFacing: LensFacing.Back,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scanResult = data?.barcode?.displayValue;
      
      let idAlumno = this.authService.getCurrentUser;
      const payload = { id_alumno:idAlumno, codigo:this.scanResult }
      this.http.post(`${this.apiUrl}/admitirAlumno`, payload).subscribe({
        next: (response: any) => {console.log('Alumno asistido:', response)
          console.log("alumno asistido")
        },
        error: (error) => console.error('Error al registrar en la API:', error),
      });
    }
  }

  // Leer código de barras de una imagen y guardar en la variable 'scanResult'
  async readBarcodeFromImage() {
    const { files } = await FilePicker.pickImages({});
    const path = files[0]?.path;

    if (!path) return;

    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats: [],
    });

    this.scanResult = barcodes[0].displayValue;
    let idAlumno = this.authService.getCurrentUser;
    const payload = { id_alumno:idAlumno, codigo:this.scanResult }
    this.http.post(`${this.apiUrl}/admitirAlumno`, payload).subscribe({
      next: (response: any) => {console.log('Alumno asistido:', response)
        console.log("alumno asistido")
      },
      error: (error) => console.error('Error al registrar en la API:', error),
    });
  }

  // Convertir un elemento HTML a Canvas y luego a imagen
  captureScreen() {
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      this.downLoudImage(canvas);

      if (this.platform.is('capacitor')) this.shareImage(canvas);
      else this.downLoudImage(canvas);
    });
  }

  // Descargar imagen solo para Web
  downLoudImage(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr.png';
    link.click();
  }

  // Compartir imagen en dispositivos móviles
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

  generarQR(){
    const payload = { id_clase:this.idClase }
    this.http.post(`${this.apiUrl}/generarCodigoClase`, payload).subscribe({
      next: (response: any) => {console.log('Codigo generado:', response)
        this.qrtext = response.codigo.codigo
      },
      error: (error) => console.error('Error al registrar en la API:', error),
    });
  }

  // Copiar al portapapeles
  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.scanResult,
    });

    const toast = await this.toastController.create({
      message: 'Copiado al portapapeles',
      duration: 1000,
      color: 'tertiary',
      icon: 'clipboard-outline',
      position: 'middle',
    });
    toast.present();
  };

  openCapacitorSite = async () => {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Quieres abrir realmente esta dirección URL?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: async () => {
            let url = this.scanResult;
            if (!['https://'].includes(this.scanResult))
              url = 'https://' + this.scanResult;
            await Browser.open({ url });
          },
        },
      ],
    });

    await alert.present();
  };

  // Verifica si el resultado es una URL
  isUrl() {
    let regex = /\.(com|net|io|me|crypto|ai)\b/i;
    return regex.test(this.scanResult);
  }
}
