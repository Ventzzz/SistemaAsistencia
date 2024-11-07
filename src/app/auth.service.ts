import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;
  private currentUser: string | null = null; 
  private apiUrl = 'https://asisduoc-api-77f03f161fc1.herokuapp.com'; // Cambia esta URL por tu endpoint real

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async register(Nombre: string, password: string, role: string) {
    const user = await this._storage?.get(Nombre);
    if (user) {
      throw new Error('El usuario ya existe');
    }

    // Envía los datos a la API
    const payloadRegister = { "nombre_alumno":Nombre };
    this.http.post(`${this.apiUrl}/registrarAlumno`, payloadRegister).subscribe({
      next: (response: any) => {console.log('Usuario registrado en la API:', response)
        const id = response.alumno.id;
        this.guardarId(response, Nombre, password, role);  
      },
      error: (error) => console.error('Error al registrar en la API:', error),
    });

    return true;
  }
  
  guardarId(response: any, Nombre: string, password: string, role: string){
    const id = response.alumno.id
    this._storage?.set(Nombre, { Nombre, password, role, id});
  }

  async login(Nombre: string, password: string) {
    const user = await this._storage?.get(Nombre);
    if (user && user.password === password) {
      this.currentUser = Nombre;

      return true;
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  }

  async getUserRole(): Promise<string | null> {
    const currentUser = this.currentUser;
    if (currentUser) {
      const user = await this._storage?.get(currentUser);
      return user?.role || null;
    }
    return null;
  }

  async getCurrentUser() {
    return this.currentUser; 
  }

  async getCurrentUserId(){
    const user = await this.getCurrentUser();
    const userObject = await this._storage?.get(user!)
    console.log(userObject)
    return userObject.id
  }

  async logout() {
    this.currentUser = null; 
  }
}
