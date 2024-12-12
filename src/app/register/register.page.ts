import { Component } from '@angular/core';
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
  fail: boolean = false;
  mensaje: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navController: NavController
  ) {
    this.formRegister = this.formBuilder.group({
      Nombre: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      id: ['']
    });
  }

  async registrar() {
    if (this.formRegister.invalid) {
      this.fail = true;
      this.mensaje = 'Campos inválidos';  // Aquí puedes agregar más lógica para campos específicos
      return;
    }

    try {
      const { Nombre, contraseña, role } = this.formRegister.value;
      const response = await this.authService.register(Nombre, contraseña, role);
      if (response) {
        this.navController.navigateRoot('/login');
      }
    } catch (error: unknown) {
      this.fail = true;
      this.mensaje = (error as Error).message;  // Usamos type assertion
    }
  }
}
