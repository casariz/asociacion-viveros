import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { TasksComponent } from './tasks/tasks.component';
import { WalletComponent } from './wallet/wallet.component';
import { AddMeetingsComponent } from './meetings/add-meetings/add-meetings.component';
import { AddTasksComponent } from './tasks/add-tasks/add-tasks.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    title: 'Reuniones',
  },
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Tareas',
  },
  {
    path: 'wallet',
    component: WalletComponent,
    title: 'Cartera',
  },
  {
    path: 'meetings/add-meetings',
    component: AddMeetingsComponent,
    title: 'Añadir reunion'
  },
  {
    path: 'tasks/add-tasks',
    component: AddTasksComponent,
    title: 'Añadir tarea'
  },
];
