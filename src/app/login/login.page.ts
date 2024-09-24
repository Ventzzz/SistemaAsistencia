  import { Component, OnInit } from '@angular/core';
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
        try {
          await this.authService.login(Nombre, contraseña);
          this.navCtrl.navigateRoot(''); 
        } catch (err: any) { 
          console.error('Error al iniciar sesión:', err.message);
        }
      }
    }
  }
