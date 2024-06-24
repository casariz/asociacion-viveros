import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes

// Servicios
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-assign-tasks',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './assign-tasks.component.html',
  styleUrls: ['./assign-tasks.component.css']
})
export class AssignTasksComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  isReadOnly: boolean = false;
  taskId: number | null = null;
  meetingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      meeting_description: [{value: '', disabled: true}, Validators.required],
      start_date: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      estimated_time: [{ value: 0, disabled: this.isReadOnly }, [Validators.required, Validators.min(0), Validators.max(9999)]],
      units: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      task_description: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      assigned_to_name: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      assigned_to: [{ value: '1', disabled: this.isReadOnly }, Validators.required],
      observations: [{ value: '', disabled: this.isReadOnly }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const mode = this.route.snapshot.data['mode'];

      if (id) {
        this.taskId = +id;
       this.isEditMode = mode === 'edit';
        this.isReadOnly = mode === 'view';
        this.loadTask();
      }
    });
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        this.meetingId = task.task.meeting_id;
        this.taskForm.patchValue(task.task);
        if (task.task.meeting) {
          this.taskForm.patchValue({
            meeting_description: task.task.meeting.meeting_description || '',
            assigned_to_name: task.task.assigned_to.name,
            assigned_to: task.task.assigned_to.person_id
          });
        } else {
          this.taskForm.patchValue({
            assigned_to_name: task.task.assigned_to.name,
            assigned_to: task.task.assigned_to.person_id
          });
        }  
        if (this.isReadOnly) {
          this.taskForm.disable();
        }
      });
    }
  }

  onSubmit(): void {
    console.log(this.taskForm.value);
    if (this.taskForm.invalid || this.isReadOnly) {
      return;
    }

    const taskData = this.taskForm.value;
    console.log(taskData);
    
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe(() => {
        this.router.navigate(['/tasks']); // Redirige a la lista de tareas
      });
    } else {
      console.log("hola");
      
      this.taskService.createTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']); // Redirige a la lista de tareas
      });
    }
  }
}
