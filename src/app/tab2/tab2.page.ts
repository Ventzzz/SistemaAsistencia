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
    {nombre: "PGY4121", asignatura: "Programación de aplicaciones"},
    {nombre: "PGY2121", asignatura: "Desarrollo de bases de datos"},
    {nombre: "MDY3101", asignatura: "Arquitectura de datos"},
  ]


  constructor() {
    this.nombre = "Ana Diaz";
    this.asignatura = "Programación de aplicaciones";
  }
}
