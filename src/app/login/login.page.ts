import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';

  @Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
  })

  export class LoginPage {
    formLogin: FormGroup;
    formRegister: any;
  mensaje: string = '';
  fail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.formLogin = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(4)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async ingresar() {
    if (this.formLogin.valid) {
      const { Nombre, contraseña } = this.formLogin.value;
      this.fail = false;
      try {
        await this.authService.login(Nombre, contraseña);
        this.navCtrl.navigateRoot(''); 
      } catch (err: any) { 
        this.mensaje = 'Error al iniciar sesión:';
        this.fail = true;
      }
    }
  }

  async recoverPassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar contraseña',
      message: 'Por favor, introduce tu usuario y la nueva contraseña.',
      inputs: [
        {
          name: 'Nombre',
          type: 'text',
          placeholder: 'Usuario'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cambiar',
          handler: async (data) => {
            if (data.Nombre && data.newPassword && data.confirmPassword) {
              if (data.newPassword !== data.confirmPassword) {
                this.showToast('Las contraseñas no coinciden.');
              } else {
                try {
                  await this.authService.updatePassword(data.Nombre, data.newPassword);
                  this.showToast('Contraseña actualizada exitosamente.');
                } catch (error) {
                  this.showToast('Usuario no encontrado.');
                }
              }
            } else {
              this.showToast('Por favor, completa todos los campos.');
            }
          }
        }
      ]
    });
    await alert.present();
  }
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
