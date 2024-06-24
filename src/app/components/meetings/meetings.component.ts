import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { Meetings } from '../../interfaces/meetings';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [RouterLink, CommonModule,ReactiveFormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  filterForm: FormGroup;
  meetings: Meetings[] = [];  // Aquí irán tus reuniones
  filteredMeetings: Meetings[] = [];
  status: any[] = [ ]

  constructor(private fb: FormBuilder, 
    private meetingsService: MeetingsService, 
    private statusService: StatusService) {

    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.getStatusMeetings()
    this.getMeetings();
    this.filteredMeetings = this.meetings;
  }

  getMeetings(): void {
    this.meetingsService.getMeetings().subscribe({
      next: (value) => {
        this.meetings = value.data;
        this.filteredMeetings = this.meetings 
      },
      error: (err) => {
        
      },
    })

    this.filteredMeetings = this.meetings;
  }

  getStatusMeetings(): void {
    this.statusService.getStatusMeetings().subscribe({
      next:(value) => {
        this.status = value.status
      },
      error:(err) => {
        
        console.log("Error al traer status: ", err);
      },
    })
  }

  applyFilters(): void {
    const { startDate, endDate, employee, description, status } = this.filterForm.value;

    this.filteredMeetings = this.meetings.filter(meeting => {
      const matchesStartDate = !startDate || new Date(meeting.meeting_date) >= new Date(startDate);
      const matchesEndDate = !endDate || new Date(meeting.meeting_date) <= new Date(endDate);
      const matchesEmployee = !employee || meeting.called_by.toString().toLowerCase().includes(employee.toLowerCase());
      const matchesDescription = !description || meeting.meeting_description.toLowerCase().includes(description.toLowerCase());
      const matchesStatus = !status || meeting.status === status;

      return matchesStartDate && matchesEndDate && matchesEmployee && matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredMeetings = this.meetings;
  }
}
