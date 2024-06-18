import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TasksInterface } from '../../interfaces/tasks.interface';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  tasks: TasksInterface[] = [];

  constructor( private taskService: TaskService) {
    this.getTask();
  }

  getTask(){
    this.taskService.getTasks().subscribe({
      next:(value) => {
        this.tasks = value.tasks
        console.log(this.tasks)
      },
    })
  }
}
