import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    {asignatura: "Programación de aplicaciones", fecha: "19-09-2021", presente: "89%" },
    {asignatura: "Desarrollo de bases de datos", fecha: "20-09-2021", presente: "70%" },
    {asignatura: "Arquitectura de datos", fecha: "21-09-2021", presente: "90%"  },
  ]


  constructor(private router:Router) {
    this.presente = "";
    this.asignatura = "";
    this.fecha = "";
  }
  verModal()
  {
    this.mostrar = !this.mostrar;
  }

  abrirPaginaQr()
  {
    this.router.navigate(['/scanner-qr']);

  }

  }
