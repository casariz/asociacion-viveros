import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  filterForm: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];
  status: any[] = []

  constructor(private fb: FormBuilder,
    private userService: UsersService
  ){
    this.filterForm = this.fb.group({
      employee: [''],
      status: this.fb.array([])
    });
  }

  ngOnInit(){
    this.getUsers()
  }

  getUsers(): void{
    this.userService.getUsers().subscribe({
      next:(value)=> {
        console.log(value);
        this.users = value
        this.filteredUsers = this.users;
      },
      error:(err)=> {
        
      },
    })
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    this.status.forEach(state => {
      if (state === 'Activo') {
        statusFormArray.push(this.fb.control(state));
      }
    });
  }

  applyFilters() {
    const { startDate, endDate, employee, description, status } = this.filterForm.value;
    this.filteredUsers = this.users.filter((user) => {
      const matchesStartDate =
        !startDate || new Date(user.start_date) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(user.start_date) <= new Date(endDate);
      const matchesEmployee =
        !employee || user.assigned_to?.toString().includes(employee);
      const matchesDescription =
        !description ||
        user.task_description
          ?.toLowerCase()
          .includes(description.toLowerCase());
        const matchesStatus = status.length === 0 || status.includes(user.status.description);
      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesEmployee &&
        matchesDescription && matchesStatus
      );
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultStatus();
    this.filteredUsers = this.users;
  }

  get statusFormArray() {
    return this.filterForm.get('status') as FormArray;
  }

  onStatusChange(event: any, state: string): void {
    const statusFormArray = this.statusFormArray;
    if (event.target.checked) {
      statusFormArray.push(this.fb.control(state));
    } else {
      const index = statusFormArray.controls.findIndex(x => x.value === state);
      statusFormArray.removeAt(index);
    }
    this.applyFilters();
  }
}
