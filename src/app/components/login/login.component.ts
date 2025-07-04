import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  userType: string | null = null;
  submitted = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit():void {
    if (this.loginForm.invalid) {
      this.submitted = true;
      return;
    }
    const loginData = this.loginForm.value;
    
    this.authService.login(loginData).subscribe({
      next: (response) => {
        // this.authService.saveToken(response.token);
        // this.authService.fetchUserType().subscribe((response) => {
        //   if (response) {
            
            
        //     this.userType = response.user_type;
        //     localStorage.setItem('user-type', response.user_type);
        //   }
        // });
        this.router.navigate(['/meetings']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
