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

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      id_task: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      date: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      estimated_time: [{ value: 0, disabled: this.isReadOnly }, [Validators.required, Validators.min(0), Validators.max(9999)]],
      units: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      task_description: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      worker_id: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      department_id: [{ value: '', disabled: this.isReadOnly }, Validators.required],
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
        // let data = {};
        // this.taskForm.patchValue(data);
        // this.taskForm.get('observations')?.setValue('test');
      }
    });
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        this.taskForm.patchValue(task);
        if (this.isReadOnly) {
          this.taskForm.disable(); // Deshabilitar todo el formulario en modo solo lectura
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isReadOnly) {
      return;
    }

    const taskData = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe(() => {
        this.router.navigate(['/tasks']); // Redirige a la lista de tareas
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']); // Redirige a la lista de tareas
      });
    }
  }
}
