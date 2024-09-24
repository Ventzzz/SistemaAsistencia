import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;

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
      return true;
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  }

  async logout() {
  }
}
