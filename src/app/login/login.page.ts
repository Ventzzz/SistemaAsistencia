import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController
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
}
