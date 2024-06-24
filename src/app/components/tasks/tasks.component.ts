import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Tasks } from '../../interfaces/tasks';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  status: any[] = [ ]

  constructor(private fb: FormBuilder, 
    private taskService: TaskService, 
    private statusService: StatusService) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
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
      },
    });
  }
  
  getStatusTasks(): void {
    this.statusService.getStatusTasks().subscribe({
      next:(value) => {
        this.status = value.status
      },
      error:(err) => {
        console.log("Error al traer status: ", err);
      },
    })
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
    const { startDate, endDate, employee, description } = this.filterForm.value;
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
      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesEmployee &&
        matchesDescription
      );
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredTasks = this.tasks;
  }
}
