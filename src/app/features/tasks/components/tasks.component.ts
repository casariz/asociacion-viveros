import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TaskService } from '../services/task.service';
import { Tasks } from '../interfaces/tasks';
import { MeetingsService } from '../../meetings/services/meetings.service';
import { SectionHeaderComponent } from '../../../components/section-header/components/section-header.component';
import { DataTableComponent } from '../../../components/data-table/components/data-table.component';
import { Column } from '../../../components/data-table/interfaces/data-table';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SectionHeaderComponent, DataTableComponent, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  userRole: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  columns: Column[] = [
    { key: 'taskInfo', label: 'ID [Reunión]' },
    { key: 'reportadoPor', label: 'Reportó' },
    { key: 'fechaEstimado', label: 'Fecha - Tiempo estimado' },
    { key: 'responsale', label: 'Responsable' },
    { key: 'descriptions', label: 'Descripción - Observaciones' },
    { key: 'statusText', label: 'Estado' },
    { key: 'acciones', label: 'Acciones' }
  ];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit(): void {
    this.getUserRole();
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
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks(page).subscribe({
      next: (value) => {
        this.tasks = value.data;
        this.currentPage = value.current_page;
        this.totalPages = value.last_page;
        this.filteredTasks = this.tasks;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching tasks: ", err);
        this.errorMessage = 'Error al cargar tareas.';
        this.isLoading = false;
      }
    });
  }

  getUserRole(): void {
    this.userRole = localStorage.getItem('userRole') || 'Usuario';
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  rejectTask(id: number) {
    this.taskService.rejectTask(id).subscribe({
      next: () => {
        this.getTasks(this.currentPage);
      },
      error: (err) => {
        console.error('Error rejecting task:', err);
        this.errorMessage = 'Error al rechazar la tarea.';
      },
    });
  }

  completeTask(id: number) {
    this.taskService.completeTask(id).subscribe({
      next: () => {
        this.getTasks(this.currentPage);
      },
      error: (err) => {
        console.error('Error completing task:', err);
        this.errorMessage = 'Error al completar la tarea.';
      },
    });
  }

  applyFilters(filters: { startDate?: string; endDate?: string; description?: string; status?: number }) {
    const { startDate, endDate, description, status } = filters;
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesStartDate =
        !startDate || new Date(task.start_date) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(task.start_date) <= new Date(endDate);
      const matchesDescription =
        !description ||
        (task.task_description && task.task_description.toLowerCase().includes(description.toLowerCase())) ||
        (task.observations && task.observations.toLowerCase().includes(description.toLowerCase()));
      const matchesStatus = (status === undefined || status === null || task.status.status === status);

      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesDescription &&
        matchesStatus
      );
    });
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
  }

  resetFilters(): void {
    this.filteredTasks = this.tasks;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
  }

  get paginatedTasks(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTasks.slice(start, end).map(task => ({
      ...task,
      taskInfo: `${task.task_id}${task.meeting ? ' [' + task.meeting.meeting_id + ']' : ''}`,
      reportadoPor: task.created_by?.first_name || 'N/A',
      fechaEstimado: `${task.start_date}${task.estimated_time ? ', ' + task.estimated_time + ' ' + task.units : ''}`,
      responsale: task.assigned_to?.first_name || 'N/A',
      descriptions: `${task.task_description || ''}${task.observations ? (task.task_description ? ' - ' : '') + task.observations : ''}`,
      statusText: task.status?.description || 'N/A',
    }));
  }
}
