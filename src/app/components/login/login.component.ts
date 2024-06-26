import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginData = this.loginForm.value;
    
    this.authService.login(loginData).subscribe({
      next: (response) => {
        // Asumiendo que la respuesta tiene el token en 'response.token'
        this.authService.saveToken(response.token);
        console.log('Login successful');
        this.router.navigate(['/meetings']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
