import { Component,  EventEmitter, Output } from '@angular/core';
import {RouterModule} from '@angular/router';
import { SidenavService } from '../../services/sidenav-service';

@Component({
  selector: 'app-sidenav-component',
  imports: [RouterModule],
  templateUrl: './sidenav-component.html',
  styleUrl: './sidenav-component.css'
})
export class SidenavComponent {

  isCollapsed = false;

  @Output() collapsedChange = new EventEmitter<boolean>();
  constructor(private sidenavService: SidenavService) {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    console.log('isCollapsed:', this.isCollapsed);
    this.collapsedChange.emit(this.isCollapsed);
    this.sidenavService.setCollapsed(this.isCollapsed);
  }
}
