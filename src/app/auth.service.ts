import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;
  private currentUser: string | null = null; 

  constructor(private storage: Storage) {
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
    await this._storage?.set(Nombre, { Nombre, password, role });
    return true;
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

  async updatePassword(Nombre: string, newPassword: string) {
    const user = await this._storage?.get(Nombre);
    if (user) {
      await this._storage?.set(Nombre, { ...user, password: newPassword });
    } else {
      throw new Error('Usuario no encontrado');
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

  async logout() {
    this.currentUser = null; 
  }
}
