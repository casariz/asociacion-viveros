import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-meetings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-meetings.component.html',
  styleUrl: './add-meetings.component.css'
})
export class AddMeetingsComponent implements OnInit {
  meetingForm: FormGroup;
  taskList: { type: string, comment: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.meetingForm = this.fb.group({
      meeting_date: ['', Validators.required],
      start_hour: ['', Validators.required],
      caller_id: ['', Validators.required],
      placement: ['', Validators.required],
      department_id: ['', Validators.required],
      meeting_description: ['', Validators.required],
      assistant_id: ['', Validators.required],
      topyc_type: ['Orden del dia', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      console.log('Form Submitted!', this.meetingForm.value);
      // Lógica para manejar el envío del formulario
    } else {
      console.log('Form is invalid');
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
