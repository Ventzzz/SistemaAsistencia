import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup; 

  constructor(public fb: FormBuilder) {
    this.formLogin = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'contraseña': new FormControl("",Validators.required),
      
    })

  }

  ngOnInit() {
  }
  ingresar(){
    if(this.formLogin.valid){
      const{nombre, contraseña}= this.formLogin.value;
      console.log('Nombre', nombre);
      console.log('Contraseña', contraseña)
    } else {
      console.log('Formulario no válido')
    }
  }
}
