import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {SidenavComponent} from './components/sidenav-component/sidenav-component';
import {NavbarComponent} from './components/navbar-component/navbar-component';
import {UiStateService} from './services/ui-state-service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,SidenavComponent, NavbarComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'IntelTaskUCR-FrontEnd';
  sidenavCollapsed = false;

  mostrarNavbar = true;
  mostrarSidebar = true;

  constructor(private router: Router, private uiState: UiStateService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.actualizarLayoutSegunRuta(currentUrl);
      });
  }

  private actualizarLayoutSegunRuta(ruta: string): void {
    if (ruta === '/login') {
      this.ocultarElementosLayout();
    } else {
      this.mostrarElementosLayout();
    }
  }

  private ocultarElementosLayout(): void {
    this.mostrarNavbar = false;
    this.mostrarSidebar = false;
  }

  private mostrarElementosLayout(): void {
    this.mostrarNavbar = true;
    this.mostrarSidebar = true;
  }

  get rutaEsLogin(): boolean {
    return this.router.url.includes('login'); // o como se llame tu ruta de login
  }


}

