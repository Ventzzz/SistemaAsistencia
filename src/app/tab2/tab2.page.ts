import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar peticiones HTTP
import { ToastController } from '@ionic/angular'; // Importa ToastController para mostrar mensajes

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  nombre: string;
  asignatura: string;
  nombreClase: string = ''; // Almacena el nombre de la clase
  horarioClase: string = ''; // Almacena el horario de la clase
  asignaturas: any[] = []; // Lista de asignaturas obtenidas desde la API

  isAdmin: boolean = false;
  mostrar: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient, // Inyecta HttpClient
    private toastController: ToastController // Inyecta ToastController
  ) {
    this.nombre = "";
    this.asignatura = "";
  }

  async ngOnInit() {
    const role = await this.authService.getUserRole();
    this.isAdmin = role === 'admin';

    // Obtener las clases al cargar el componente
    this.obtenerClases();
  }

  verModal() {
    this.mostrar = !this.mostrar;
  }

  // Método para obtener las clases desde la API
  obtenerClases() {
    this.http.get<any[]>('https://asisduoc-api-77f03f161fc1.herokuapp.com/obtenerClases')
      .subscribe(
        (data) => {
          this.asignaturas = data; // Asigna los datos obtenidos al arreglo de asignaturas
        },
        (error) => {
          console.error('Error al obtener clases:', error);
          this.presentToast('Error al cargar las clases.');
        }
      );
  }

  // Método para crear una clase mediante una solicitud POST
  async crearClase(event: Event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const nuevaClase = {
      nombre_clase: this.nombreClase,
      horario: this.horarioClase
    };

    try {
      const response = await this.http.post('https://asisduoc-api-77f03f161fc1.herokuapp.com/crearClase', nuevaClase).toPromise();
      this.presentToast('Clase creada exitosamente.');
      this.verModal(); // Cierra el modal después de crear la clase

      // Limpia los campos del formulario
      this.nombreClase = '';
      this.horarioClase = '';

      // Recarga la lista de clases
      this.obtenerClases();
    } catch (error) {
      this.presentToast('Error al crear la clase. Intente nuevamente.');
      console.error('Error:', error);
    }
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
}
