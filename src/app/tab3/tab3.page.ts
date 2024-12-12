import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  clases: any[] = []; // Almacena la información de asistencia obtenida desde la API
  private apiUrl = 'https://asisduoc-api-77f03f161fc1.herokuapp.com';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Llama al método para obtener la asistencia al cargar el componente
    this.obtenerAsistencia();
  }

  // Método para obtener la asistencia desde la API
  obtenerAsistencia() {
    // Consumir la API sin necesidad de pasar el id del alumno
    this.http.get(`${this.apiUrl}/obtenerAsistenciaUsuario`).subscribe({
      next: (response: any) => {
        console.log('Asistencia:', response);
        // Aquí asumimos que la API devuelve un array de clases directamente
        this.clases = response; // Asegúrate de que 'asistencia' es la clave correcta
      },
      error: (error) => {
        console.error('Error al obtener asistencia:', error);
        this.presentToast('Error al cargar las asistencias.');
      }
    });
  }

  // Método para mostrar un mensaje de confirmación o error
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  abrirPaginaQr() {
    this.router.navigate(['/scanner-qr']);
  }
}
