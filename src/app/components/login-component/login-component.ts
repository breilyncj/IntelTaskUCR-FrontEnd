import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {LoginService} from '../../services/login-service';
import {Login} from '../../models/login.model';
import {Usuario} from '../../models/usuario.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent implements OnInit {

  login: Login[] = [];
  form: FormGroup;
  usuario: Usuario | null = null;

  constructor(  private fb: FormBuilder, private loginService: LoginService, private router: Router ){
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenna: ['', Validators.required]
    });
  }

  autenticar() {
    const login: Login = this.form.value;

    this.loginService.autenticar(login).subscribe({
      next: (response) => {
        console.log('Response:', response);
        console.log('Usuario logeado:', response.usuario); // a futuro con jwt
        this.loginService.login(response.usuario); // Guarda el usuario logeado
        this.router.navigate(['/home']); // Redirige a la página deseada
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'El correo o la contraseña no son válidos. Revise e intente de nuevo.'
        });
      }
    });
  }


  ngOnInit(): void {

  }

}
