import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;
  private currentUser: string | null = null; // Variable para almacenar el nombre del usuario logueado

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async register(Nombre: string, password: string) {
    const user = await this._storage?.get(Nombre);
    if (user) {
      throw new Error('El usuario ya existe');
    }
    await this._storage?.set(Nombre, { Nombre, password });
    return true;
  }

  async login(Nombre: string, password: string) {
    const user = await this._storage?.get(Nombre);
    if (user && user.password === password) {
      this.currentUser = Nombre; // Guardar el nombre del usuario logueado
      return true;
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  }

  async getCurrentUser() {
    return this.currentUser; // Retorna el nombre del usuario logueado
  }

  async logout() {
    this.currentUser = null; // Limpiar el nombre del usuario al cerrar sesión
  }
}
