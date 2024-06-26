import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { Meetings } from '../../interfaces/meetings';
import { StatusService } from '../../services/status.service';
import { AssignTasksComponent } from '../assign-tasks/assign-tasks.component';

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
  filteredMeetings: Meetings[] = [];
  status: any[] = [];
  @ViewChild(AssignTasksComponent) meeting?: AssignTasksComponent;
  

  constructor(private fb: FormBuilder, 
              private meetingsService: MeetingsService, 
              private statusService: StatusService,
              private router: Router) {

    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      employee: [''],
      description: [''],
      status: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getStatusMeetings();
    this.getMeetings();
  }

  addTaskInMeeting(id: number){
    if (this.meeting) {
      this.meeting.meeting_id = id;
      this.router.navigate(['/tasks/new']);
    } else {
      console.error('AssignTasksComponent is not initialized.');
    }
  }

  getMeetings(): void {
    this.meetingsService.getMeetings().subscribe({
      next: (value) => {
        this.meetings = value.data;
        this.filteredMeetings = this.meetings;
        this.applyFilters();
      },
      error: (err) => {
        console.log("Error al traer reuniones: ", err);
      },
    });
  }

  getStatusMeetings(): void {
    this.statusService.getStatusMeetings().subscribe({
      next:(value) => {
        this.status = value.status;
        this.setDefaultStatus();
        this.applyFilters() // Establecer los estados por defecto
      },
      error:(err) => {
        console.log("Error al traer status: ", err);
      },
    });
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    // Agregar los estados por defecto ("Creado" y "Realizado")
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
    this.setDefaultStatus(); // Restablecer los estados por defecto
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
}
