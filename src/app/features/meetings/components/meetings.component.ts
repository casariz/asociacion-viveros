import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meetings } from '../interfaces/meetings';
import { MeetingsService } from '../services/meetings.service';
import { StatusService } from '../../../services/status.service';
import { TopicsService } from '../services/topics.service';
import { SectionHeaderComponent } from '../../../components/section-header/components/section-header.component';
import { DataTableComponent } from '../../../components/data-table/components/data-table.component';
import { Column } from '../../../components/data-table/interfaces/data-table';
import { AddMeetingsComponent } from './add-meetings/add-meetings.component';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [SectionHeaderComponent, DataTableComponent, AddMeetingsComponent],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  meetings: Meetings[] = [];
  filteredMeetings: Meetings[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  isAddMeetingModalOpen: boolean = false;

  userRole: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  columns: Column[] = [
    { key: 'meeting_id', label: 'ID' },
    { key: 'called_by', label: 'Reportó' },
    { key: 'fechaLugar', label: 'Fecha - Lugar' },
    { key: 'meeting_description', label: 'Descripción' },
    { key: 'topics', label: 'Orden del día' },
    { key: 'acciones', label: 'Acciones' }
  ];

  constructor(
    private router: Router,
    private meetingsService: MeetingsService,
  ) { }

  ngOnInit(): void {
    this.getUserRole();
    this.fetchMeetings();
  }

  fetchMeetings(): void {
    this.isLoading = true;
    this.meetingsService.getMeetings(this.currentPage).subscribe({
      next: (response) => {
        console.log('Reuniones obtenidas:', response['data']);
        
        this.meetings = response.data;
        this.filteredMeetings = this.meetings;
        this.totalPages = response.last_page;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar reuniones.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(filters: { startDate: string; endDate: string; description: string }): void {
    const { startDate, endDate, description } = filters;

    this.filteredMeetings = this.meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date);
      const withinDate = (!startDate || meetingDate >= new Date(startDate)) &&
        (!endDate || meetingDate <= new Date(endDate));

      const descriptionMatch = !description || meeting.meeting_description.toLowerCase().includes(description.toLowerCase());

      return withinDate && descriptionMatch;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredMeetings.length / this.itemsPerPage);
  }

  resetFilters(): void {
    this.filteredMeetings = this.meetings;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredMeetings.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleTableAction(action: string, meeting: Meetings): void {
    switch (action) {
      case 'complete':
        this.completeMeeting(meeting.meeting_id);
        break;
      case 'edit':
        this.router.navigate(['/meetings', meeting.meeting_id, 'edit']);
        break;
      case 'view':
        this.router.navigate(['/meetings', meeting.meeting_id, 'view']);
        break;
      case 'add-task':
        this.addTaskInMeeting(meeting.meeting_id);
        break;
    }
  }

  completeMeeting(id: number): void {
    this.meetingsService.completeMeeting(id).subscribe({
      next: () => location.reload(),
      error: (err) => console.log('Algo ha fallado:', err)
    });
  }

  addTaskInMeeting(id: number): void {
    this.meetingsService.setMeetingId(id);
    this.router.navigate(['/tasks/new']);
  }

  getUserRole(): void {
    this.userRole = localStorage.getItem('userRole') || 'Usuario';
  }

  openAddMeetingModal(): void {
    this.isAddMeetingModalOpen = true;
  }

  closeAddMeetingModal(): void {
    this.isAddMeetingModalOpen = false;
    this.fetchMeetings(); // Refresh the list after closing modal
  }

  get paginatedMeetings(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMeetings.slice(start, start + this.itemsPerPage).map(meeting => ({
      ...meeting,
      fechaLugar: `${meeting.meeting_date} - ${meeting.placement}`,
      called_by: (meeting.called_by && meeting.called_by.first_name) ? meeting.called_by.first_name : 'N/A', // Changed from 'Pepe'
      topics: Array.isArray(meeting.topics)
        ? meeting.topics.map((topic: any) => topic.topic).join(', ')
        : typeof meeting.topics === 'object' && meeting.topics !== null && 'topic' in meeting.topics
        ? meeting.topics.topic
        : typeof meeting.topics === 'string' ? meeting.topics : 'Sin temas'
    }));
  }
}