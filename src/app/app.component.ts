import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { Home, Users, SquareCheckBig, Wallet } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'asociacion-viveros';

  activeSection = 'dashboard';

  readonly homeIcon = Home;
  readonly usersIcon = Users;
  readonly tasksIcon = SquareCheckBig;
  readonly walletIcon = Wallet;

  navItems = [
    { id: 'dashboard', name: 'Inicio', path: '/dashboard', icon: this.homeIcon },
    { id: 'meetings', name: 'Reuniones', path: '/meetings', icon: this.usersIcon },
    { id: 'tasks', name: 'Tareas', path: '/tasks', icon: this.tasksIcon },
    { id: 'wallet', name: 'Cartera', path: '/wallet', icon: this.walletIcon },
  ];

  onSectionChange(newSection: string) {
    this.activeSection = newSection;
  }
}
