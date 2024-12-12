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
  isAdmin: boolean = false;

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
    if (this.formLogin.invalid) {
      this.fail = true;
      this.mensaje = 'Campos inválidos';  // Mensaje de error en caso de formulario inválido
      this.showToast(this.mensaje); // Muestra el toast con el mensaje
      return;  // No hacer nada más si el formulario es inválido
    }
  
    const { Nombre, contraseña } = this.formLogin.value;
    this.fail = false;
    try {
      await this.authService.login(Nombre, contraseña);
      const role = await this.authService.getUserRole();
      this.isAdmin = role === 'admin';
      this.navCtrl.navigateRoot('');
      this.showToast('Login exitoso');  // Aquí agregamos el toast en caso de éxito
    } catch (err: any) {
      this.mensaje = 'Error al iniciar sesión: ' + err.message;
      this.fail = true;
      this.showToast(this.mensaje); // Muestra el toast en caso de error
    }
  }
  
  
  

  async recoverPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Por favor, introduce tu correo electrónico para enviar un enlace de recuperación.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo Electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: (data) => {
            if (data.email) {
              this.showToast('Se ha enviado el enlace de recuperación a tu correo.');
            } else {
              this.showToast('Por favor, introduce un correo válido.');
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
