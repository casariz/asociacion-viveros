import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MeetingsService } from '../../../services/meetings.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-meetings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-meetings.component.html',
  styleUrl: './add-meetings.component.css'
})
export class AddMeetingsComponent implements OnInit {
  meetingForm: FormGroup;
  isEditMode: boolean = false;
  meetingId: number | null = null;
  taskList: { type: string, comment: string }[] = [];

  constructor(private fb: FormBuilder, 
    private meetingsService: MeetingsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.meetingForm = this.fb.group({
      meeting_date: ['', Validators.required],
      start_hour: ['', Validators.required],
      called_by: ['', Validators.required],
      called_by_name: ['', Validators.required],
      placement: ['', Validators.required],
      meeting_description: ['', Validators.required],
      assistant_id: ['', Validators.required],
      topyc_type: ['Orden del dia', Validators.required],
      topics: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const mode = this.route.snapshot.data['mode'];

      if (id) {
        this.meetingId = +id;
        this.isEditMode = mode === 'edit';
        this.loadMeeting();
      }
    });
  }

  loadMeeting(): void {
    if (this.meetingId) {
      this.meetingsService.getMeetingById(this.meetingId).subscribe(meeting => {
        console.log(meeting.meeting);
        
        this.meetingId = meeting.meeting.meeting_id;
        this.meetingForm.patchValue(meeting.meeting);
        if (meeting.meeting) {
          this.meetingForm.patchValue({
            called_by: meeting.meeting.called_by.person_id,
            called_by_name: meeting.meeting.called_by.name
          });
        }
      });
    }
  }

  onSubmit(): void {

    const meetingData = this.meetingForm.value;
    console.log(meetingData);
    
    if (this.isEditMode && this.meetingId) {
      this.meetingsService.updateMeeting(this.meetingId, meetingData).subscribe(() => {
        this.router.navigate(['/meetings']); // Redirige a la lista de tareas
      });
    } else {
      this.meetingsService.createMeeting(meetingData).subscribe(() => {
        this.router.navigate(['/meetings']); // Redirige a la lista de tareas
      });
    }
  }

  addTask(): void {
    const type = this.meetingForm.get('topyc_type')?.value;
    const comment = this.meetingForm.get('comment')?.value;
    if (type && comment) {
      this.taskList.push({ type, comment });
      this.meetingForm.get('comment')?.reset();
    }
  }

  removeTask(index: number): void {
    this.taskList.splice(index, 1);
  }
}
