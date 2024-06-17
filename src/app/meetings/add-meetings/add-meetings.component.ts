import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-meetings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-meetings.component.html',
  styleUrl: './add-meetings.component.css'
})
export class AddMeetingsComponent {
  meetingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.meetingForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      topic: ['', Validators.required],
      location: ['', Validators.required],
      room: ['', Validators.required],
      organizer: ['', Validators.required],
      participants: ['', Validators.required],
      agenda: ['', Validators.required],
      notes: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      // Lógica para manejar la sumisión del formulario
    }
  }

}
