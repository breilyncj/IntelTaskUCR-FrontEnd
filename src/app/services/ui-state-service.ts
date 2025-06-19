import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {LoginService} from './login-service';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  private showLayoutSubject = new BehaviorSubject<boolean>(true);
  showLayout$ = this.showLayoutSubject.asObservable();

  constructor(private loginService: LoginService) {
    this.actualizarEstadoLayout();
  }

  showLayout() {
    this.showLayoutSubject.next(true);
  }

  hideLayout() {
    this.showLayoutSubject.next(false);
  }


  actualizarEstadoLayout() {
    const isLoggedIn = this.loginService.isLoggedIn();
    this.showLayoutSubject.next(isLoggedIn);
  }

}
