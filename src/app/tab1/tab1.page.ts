import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de que esta ruta es correcta

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  nombreUsuario: string | null = null; // Declarar la propiedad

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.nombreUsuario = await this.authService.getCurrentUser(); // Obtener el nombre del usuario logueado
  }
}
