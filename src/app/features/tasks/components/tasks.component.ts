import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { StatusService } from '../../../services/status.service';
import { Tasks } from '../interfaces/tasks';
import { MeetingsService } from '../../meetings/services/meetings.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  filterForm: FormGroup;
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  status: any[] = [];
  userRole: string | null = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private statusService: StatusService,
    private meetingsService: MeetingsService
    ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
      status: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getStatusTasks();
    this.getTasks(this.currentPage);
  }

  createTaskWithoutMeeting(): void {
    this.meetingsService.clearMeetingId();
    this.router.navigate(['/tasks/new']);
  }

  editTaskWithoutMeeting(id: any): void {
    this.meetingsService.clearMeetingId();
    this.router.navigate(['/', 'tasks', id, 'edit']);
  }

  viewTaskWithoutMeeting(id: any): void {
    this.meetingsService.clearMeetingId();
    this.router.navigate(['/', 'tasks', id, 'view']);
  }

  getTasks(page: number) {
    this.taskService.getTasks(page).subscribe({
      next: (value) => {
        this.tasks = value.data;
        this.currentPage = value.current_page;
        this.totalPages = value.last_page;
        this.filteredTasks = this.tasks;
        this.applyFilters();
      },
    });
  }
  
  getStatusTasks(): void {
    this.statusService.getStatusTasks().subscribe({
      next:(value) => {
        this.status = value.status;
        this.setDefaultStatus();
        this.applyFilters();
      },
      error:(err) => {
        console.log("Error al traer status: ", err);
      },
    })
  }

  getUserRole():void{
    this.userRole = ''; // Removed authService usage
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.getTasks(page);
    }
  }

  getPageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    this.status.forEach(state => {
      if (state === 'Pendiente' || state === 'Asignada' || state === 'Completada') {
        statusFormArray.push(this.fb.control(state));
      }
    });
  }

  rejectTask(id: number) {
    this.taskService.rejectTask(id).subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        console.log('Algo ha fallado:', err);
      },
    });
  }

  completeTask(id: number) {
    this.taskService.completeTask(id).subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        console.log('Algo ha fallado:', err);
      },
    });
  }

  applyFilters() {
    const { startDate, endDate, employee, description, status } = this.filterForm.value;
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesStartDate =
        !startDate || new Date(task.start_date) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(task.start_date) <= new Date(endDate);
      const matchesEmployee =
        !employee || task.assigned_to?.toString().includes(employee);
      const matchesDescription =
        !description ||
        task.task_description
          ?.toLowerCase()
          .includes(description.toLowerCase());
        const matchesStatus = status.length === 0 || status.includes(task.status.description);
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
    this.filteredTasks = this.tasks;
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
