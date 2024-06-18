import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { AddMeetingsComponent } from './components/meetings/add-meetings/add-meetings.component';
import { AssignTasksComponent } from './components/assign-tasks/assign-tasks.component';
import { AddWalletComponent } from './components/wallet/add-wallet/add-wallet.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    title: 'Reuniones',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Tareas',
    pathMatch: 'full'
  },
  {
    path: 'wallet',
    component: WalletComponent,
    title: 'Cartera',
    pathMatch: 'full'
  },
  {
    path: 'meetings/add-meetings',
    component: AddMeetingsComponent,
    title: 'Añadir reunion',
    pathMatch: 'full'
  },
  {
    path: 'meetings/assign-tasks',
    component: AssignTasksComponent,
    title: 'Asignar tarea', 
    pathMatch: 'full'
  },
  {
    path: 'wallet/add-wallet',
    component: AddWalletComponent,
    title: 'Añadir cartera',
    pathMatch: 'full'
  }
];
