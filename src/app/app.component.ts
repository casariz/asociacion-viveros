import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
export class AppComponent implements OnInit {
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial active section based on the current URL
    this.updateActiveSection(this.router.url);

    // Subscribe to router events to update active section on navigation changes
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveSection(event.urlAfterRedirects);
    });
  }

  updateActiveSection(url: string): void {
    const currentUrlPath = url.split('?')[0];

    const matchedItems = this.navItems.filter(item =>
      currentUrlPath === item.path || currentUrlPath.startsWith(item.path + '/')
    );

    if (matchedItems.length > 0) {
      // Sort by path length in descending order to pick the most specific match
      matchedItems.sort((a, b) => b.path.length - a.path.length);
      this.activeSection = matchedItems[0].id;
    }
    // If no match, activeSection remains as is (e.g., 'dashboard' or last valid section)
  }

  onSectionChange(newSection: string) {
    this.activeSection = newSection;
  }
}
