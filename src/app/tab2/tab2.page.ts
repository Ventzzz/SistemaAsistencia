import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  nombre: string;
  asignatura : string;

  asignaturas = [
    {nombre: "PJU2314", asignatura: "Programación de aplicaciones"},
    {nombre: "PJU2413", asignatura: "Desarrollo de bases de datos"},
    {nombre: "PJY3101", asignatura: "Arquitectura de datos"},
  ]


  constructor() {
    this.nombre = "";
    this.asignatura = "";
  }
}
