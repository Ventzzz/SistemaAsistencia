import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  formRegister: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.formRegister = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(4)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async registrar() {
    if (this.formRegister.valid) {
      const { Nombre, contraseña } = this.formRegister.value;
      try {
        await this.authService.register(Nombre, contraseña);
        this.navCtrl.navigateRoot('/login'); 
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error al registrar usuario:', err.message);
        } else {
          console.error('Error desconocido:', err);
        }
      }
    }
  }
  
}