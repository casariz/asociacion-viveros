import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { AddMeetingsComponent } from './components/meetings/add-meetings/add-meetings.component';
import { AssignTasksComponent } from './components/meetings/assign-tasks/assign-tasks.component';
import { AddTasksComponent } from './components/tasks/add-tasks/add-tasks.component';
import { AddWalletComponent } from './components/wallet/add-wallet/add-wallet.component';

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
    path: 'meetings/assign-tasks',
    component: AssignTasksComponent,
    title: 'Asignar tarea'
  },
  {
    path: 'tasks/add-tasks',
    component: AddTasksComponent,
    title: 'Añadir tarea'
  },
  {
    path: 'wallet/add-wallet',
    component: AddWalletComponent,
    title: 'Añadir cartera'
  }
];
