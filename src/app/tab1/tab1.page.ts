import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  nombreUsuario: string | null = null; 

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.nombreUsuario = await this.authService.getCurrentUser(); 
  }
}
