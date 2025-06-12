import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {


  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  constructor() { }
  setCollapsed(value: boolean) {
    this.collapsedSubject.next(value);
  }

  getCollapsed(): boolean {
    return this.collapsedSubject.value;
  }
}
