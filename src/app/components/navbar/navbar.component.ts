import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  isLoggedIn: boolean = false;
  userRole: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    this.getUserRole();
  }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  getUserRole():void{
    this.userRole = this.authService.getUserRole();
    
  }

}
