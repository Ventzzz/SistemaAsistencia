import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  presente: string;
  asignatura : string;
  fecha: string;
  mostrar = false;

  asignaturas = [
    {asignatura: "Programación de aplicaciones", fecha: "19-09-2021", presente: "Si" },
    {asignatura: "Desarrollo de bases de datos", fecha: "20-09-2021", presente: "No" },
    {asignatura: "Arquitectura de datos", fecha: "21-09-2021", presente: "Si"  },
  ]


  constructor() {
    this.presente = "";
    this.asignatura = "";
    this.fecha = "";
  }
  verModal()
  {
    this.mostrar = !this.mostrar;
  }

  }
