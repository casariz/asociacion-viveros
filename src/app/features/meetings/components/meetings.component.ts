import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Meetings } from '../interfaces/meetings';
import { MeetingsService } from '../services/meetings.service';
import { StatusService } from '../../../services/status.service';
import { TopicsService } from '../services/topics.service';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  filterForm: FormGroup;
  meetings: Meetings[] = [];
  currentPage: number = 1;
  totalPages: number = 1;  filteredMeetings: Meetings[] = [];
  topics: any[] = [];
  status: any[] = [];
  userRole: string | null = '';
  constructor(private fb: FormBuilder,
              private router: Router,
              private meetingsService: MeetingsService, 
              private statusService: StatusService,
              private topicsService: TopicsService
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
    this.getStatusMeetings();
    this.getMeetings(this.currentPage);
    this.getTopics();
  }

  addTaskInMeeting(id: number): void {
    this.meetingsService.setMeetingId(id);
    this.router.navigate(['/tasks/new']);
  }

  createTaskWithoutMeeting(): void {
    this.meetingsService.clearMeetingId();
    this.router.navigate(['/tasks/new']);
  }

  getMeetings(page: number): void {
    this.meetingsService.getMeetings(page).subscribe({
      next: (value) => {
        this.meetings = value.data;
        this.currentPage = value.current_page;
        this.totalPages = value.last_page;
        this.filteredMeetings = this.meetings;
        this.applyFilters();
      },
      error: (err) => {
        console.log("Error al traer reuniones: ", err);
      },
    });
  }

  completeMeeting(id: number) {
    this.meetingsService.completeMeeting(id).subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        console.log('Algo ha fallado:', err);
      },
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.getMeetings(page);
    }
  }

  getPageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getStatusMeetings(): void {
    this.statusService.getStatusMeetings().subscribe({
      next:(value) => {
        this.status = value.status;
        this.setDefaultStatus();
        this.applyFilters();
      },
      error:(err) => {
        console.log("Error al traer status: ", err);
      },
    });
  }

  getTopics(): void {
    this.topicsService.getTopics().subscribe({
      next:(value) => {
        this.topics = value
      },
      error:(err)=> {
        console.error('Error fetching topics: ', err);
      },
    })
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    this.status.forEach(state => {
      if (state === 'Creado' || state === 'Realizado') {
        statusFormArray.push(this.fb.control(state));
      }
    });
  }

  applyFilters(): void {
    const { startDate, endDate, employee, description, status } = this.filterForm.value;

    this.filteredMeetings = this.meetings.filter(meeting => {
      const matchesStartDate = !startDate || new Date(meeting.meeting_date) >= new Date(startDate);
      const matchesEndDate = !endDate || new Date(meeting.meeting_date) <= new Date(endDate);
      const matchesEmployee = !employee || meeting.called_by.toString().toLowerCase().includes(employee.toLowerCase());
      const matchesDescription = !description || meeting.meeting_description.toLowerCase().includes(description.toLowerCase());
      const matchesStatus = status.length === 0 || status.includes(meeting.status.description);

      return matchesStartDate && matchesEndDate && matchesEmployee && matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultStatus();
    this.filteredMeetings = this.meetings;
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
  getUserRole(): void {
    // Get user role from localStorage or set default
    this.userRole = localStorage.getItem('userRole') || 'Usuario';
  }
}
