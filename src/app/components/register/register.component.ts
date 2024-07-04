import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService){
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next:(value)=> {
        this.router.navigate(['/login']);
      },
      error:(err)=> {
        
      },
    })
  }
}
