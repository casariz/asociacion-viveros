import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Tasks } from '../../interfaces/tasks';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  concepts: any[] = ['Pendiente', 'Asignada', 'Completada', 'Rechazada'];

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
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
