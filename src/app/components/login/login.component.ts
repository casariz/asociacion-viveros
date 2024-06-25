import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  name: string = "";
  password: string = "";
  constructor(private login: AuthService, private router: Router, private http:HttpClient) { }
  api_url = 'http://localhost:8000/api'

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('password', this.password);

    this.http.post(`${this.api_url}/login`, formData)
      .subscribe(
        response => console.log(response),

        error => console.log(error)
      );
      
    // If login successful, navigate to dashboard page
    // this.router.navigate(['/meetings']);

  }
}
