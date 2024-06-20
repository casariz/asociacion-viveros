import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [RouterLink, CommonModule,ReactiveFormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  filterForm: FormGroup;
  meetings: any[] = [];  // Aquí irán tus reuniones
  filteredMeetings: any[] = [];
  concepts: any[] = [
    "Concept 1",
    "Concept 2"
  ]

  constructor(private fb: FormBuilder) {

    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.getMeetings();
    this.filteredMeetings = this.meetings;
  }

  getMeetings(): void {
    // Aquí debes cargar las reuniones (puede ser una llamada a un servicio)
    this.meetings = [
      // Ejemplo de reuniones
      { id: 1, reporter: 'John Doe', date: '2023-06-01', location: 'Nursery HQ', description: 'Discuss new planting plans', area: 'Landscaping', status: 'completed' },
      // Agrega más reuniones según sea necesario
    ];
    this.filteredMeetings = this.meetings;
  }

  applyFilters(): void {
    const { startDate, endDate, employee, description, status } = this.filterForm.value;

    this.filteredMeetings = this.meetings.filter(meeting => {
      const matchesStartDate = !startDate || new Date(meeting.date) >= new Date(startDate);
      const matchesEndDate = !endDate || new Date(meeting.date) <= new Date(endDate);
      const matchesEmployee = !employee || meeting.reporter.toLowerCase().includes(employee.toLowerCase());
      const matchesDescription = !description || meeting.description.toLowerCase().includes(description.toLowerCase());
      const matchesStatus = !status || meeting.status === status;

      return matchesStartDate && matchesEndDate && matchesEmployee && matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredMeetings = this.meetings;
  }
}
