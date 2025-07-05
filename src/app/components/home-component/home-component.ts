import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginService} from '../../services/login-service';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit{

  nombreUsuario: string | null = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const usuario = this.loginService.getUser();
    this.nombreUsuario = usuario?.cT_Nombre_usuario || 'Usuario';
  }
}
