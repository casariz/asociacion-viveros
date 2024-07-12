import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes

// Servicios
import { TaskService } from '../../services/task.service';
import { MeetingsService } from '../../services/meetings.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assign-tasks.component.html',
  styleUrls: ['./assign-tasks.component.css'],
})
export class AssignTasksComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  isReadOnly: boolean = false;
  taskId: number | null = null;
  meetingId: number | null = null;
  searchTerm: string = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  showDropdown = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private meetingsService: MeetingsService,
    private userService: UsersService
  ) {
    this.taskForm = this.fb.group({
      meeting_id: [{ value: '', disabled: true }, Validators.required],
      meeting_description: [{ value: '', disabled: true }, Validators.required],
      start_date: [
        { value: '', disabled: this.isReadOnly },
        Validators.required,
      ],
      estimated_time: [
        { value: 0, disabled: this.isReadOnly },
        [Validators.required, Validators.min(0), Validators.max(9999)],
      ],
      units: [{ value: 'Sin definir', disabled: this.isReadOnly }, Validators.required],
      task_description: [
        { value: '', disabled: this.isReadOnly },
        Validators.required,
      ],
      assigned_to: [
        { value: '', disabled: this.isReadOnly },
      ],
      assigned_to_name: [
        { value: '', disabled: this.isReadOnly },
      ],
      observations: [
        { value: '', disabled: this.isReadOnly },
        Validators.required,
      ],
      created_by: [
        { value: '1', disabled: true},
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.meetingId = this.meetingsService.getMeetingId();
    if (this.meetingId !== null) {
      this.taskForm.patchValue({
        meeting_id: this.meetingId
      });
    } else {
      this.route.paramMap.subscribe((params) => {
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
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.meetingId = task.task.meeting_id;
        this.taskForm.patchValue(task.task);
        if (task.task.meeting) {
          this.taskForm.patchValue({
            meeting_description: task.task.meeting.meeting_description || '',
            assigned_to: task.task.assigned_to.id,
            assigned_to_name: task.task.assigned_to.first_name+" "+task.task.assigned_to.last_name,
          });
        } else if (task.task.assigned_to) {
          this.taskForm.patchValue({
            assigned_to: task.task.assigned_to.id,
            assigned_to_name: task.task.assigned_to.first_name+" "+task.task.assigned_to.last_name,
          });
        }
        if (this.isReadOnly) {
          this.taskForm.disable();
        }
      });
    }
  }

  onSearch(): void {
    const searchTerm = this.taskForm.get('assigned_to_name')?.value.toLowerCase();
    if (searchTerm) {
      this.filteredUsers = this.users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm) ||
        user.last_name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [];
    }
  }

  selectUser(user: any) {
    this.taskForm.patchValue({ 
      assigned_to: user.id,
      assigned_to_name: `${user.first_name} ${user.last_name}`
    });
    this.showDropdown = false;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (value) => {
        this.users = value;
      },
      error: (err) => {
      },
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isReadOnly) {
      return;
    }
    if (this.meetingId !== null) {
      this.taskForm.get('meeting_id')?.enable();
      this.taskForm.patchValue({
        meeting_id: this.meetingId,
      });
    }

    const taskData = this.taskForm.value;

    if (!taskData.assigned_to_name) {
      taskData.assigned_to = '';
    }
    
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
