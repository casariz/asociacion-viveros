import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Tasks } from '../../interfaces/tasks';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  filterForm: FormGroup;
  tasks: Tasks[] = []; // Replace with your actual task type
  filteredTasks: Tasks[] = [];
  status: any[] = []

  constructor(private fb: FormBuilder, 
    private taskService: TaskService, 
    private statusService: StatusService) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
      status: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getStatusTasks();
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (value) => {
        this.tasks = value.data;
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

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    this.status.forEach(state => {
      if (state === 'Pendiente' || state === 'Asignada' || state === 'Completada') {
        statusFormArray.push(this.fb.control(state));
      }
    });
  }

  deleteTask(id: number, task: Tasks) {
    this.taskService.deleteTask(id, task).subscribe({
      next: (value) => {},
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
