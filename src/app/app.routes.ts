import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { AddMeetingsComponent } from './components/meetings/add-meetings/add-meetings.component';
import { AssignTasksComponent } from './components/assign-tasks/assign-tasks.component';
import { AddWalletComponent } from './components/wallet/add-wallet/add-wallet.component';

export const routes: Routes = [
  ///LOGUEO
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    pathMatch: 'full',
  },
  /// REUNIONES
  {
    path: 'meetings',
    component: MeetingsComponent,
    title: 'Reuniones',
    pathMatch: 'full',
  },
  {
    path: 'meetings/add-meetings',
    component: AddMeetingsComponent,
    title: 'Añadir reunion',
    pathMatch: 'full',
  },
  /// TAREAS
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Tareas',
    pathMatch: 'full',
  },
  {
    path: 'tasks/new',
    component: AssignTasksComponent,
    title: 'Asignar tarea',
    pathMatch: 'full',
    data: { mode: 'create' }
  },
  {
    path: 'tasks/:id/edit',
    component: AssignTasksComponent,
    title: 'Editar tarea',
    pathMatch: 'full',
    data: { mode: 'edit' }
  },
  {
    path: 'tasks/:id/view',
    component: AssignTasksComponent,
    title: 'Editar tarea',
    pathMatch: 'full',
    data: { mode: 'view' }
  },
  /// CARTERA
  {
    path: 'wallet',
    component: WalletComponent,
    title: 'Cartera',
    pathMatch: 'full',
  },
  {
    path: 'wallet/add-wallet',
    component: AddWalletComponent,
    title: 'Añadir cartera',
    pathMatch: 'full',
  },
];
