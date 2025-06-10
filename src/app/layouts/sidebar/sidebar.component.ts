import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  navItems = [
    { name: 'Inicio', path: '/dashboard' },
    { name: 'Reuniones', path: '/meetings' },
    { name: 'Tareas', path: '/tasks' },
    { name: 'Cartera', path: '/Wallet' },
  ];
}
