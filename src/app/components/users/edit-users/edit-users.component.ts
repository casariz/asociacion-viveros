import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edit-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.css',
})
export class EditUsersComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) {
    this.userForm = this.fb.group({
      id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      document_number: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      user_type: ['Escoge un tipo de usuario', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.userId = +id;
        this.loadUser();
      }
    });
  }

  loadUser(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        console.log(user);
        this.userForm.patchValue(user);
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.submitted = true;
      return;
    }

    if (this.userId !== null) {
      this.userForm.get('id')?.enable();
      this.userForm.patchValue({
        id: this.userId,
      });
    }

    const userData = this.userForm.value;

    if (this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
