import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Asegúrate de importar AuthService para obtener el rol del usuario


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  clases: any[] = []; // Almacena la información de asistencia obtenida desde la API
  idAlumno: any;
  private apiUrl = 'https://asisduoc-api-77f03f161fc1.herokuapp.com'


  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService, // Inyectar AuthService para obtener el rol de usuario

  ) {}

  ngOnInit() {
    // Llama al método para obtener la asistencia al cargar el componente
    this.obtenerAsistencia();
  }

  // Método para obtener la asistencia desde la API
  async obtenerAsistencia() {
    const idAlumno = await this.authService.getCurrentUserId();

    const payload = { alumno_id:idAlumno }
    this.http.post(`${this.apiUrl}/getAsistenciaAlumno`, payload).subscribe({
      next: (response: any) => {console.log('Asistencia:', response)
        this.clases = response.asistencia
      },
      error: (error) => console.error('Error al obtener asistencia:', error),
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
