import { Routes } from '@angular/router';
import { MeetingsComponent } from './features/meetings/components/meetings.component';
import { AddMeetingsComponent } from './features/meetings/components/add-meetings/add-meetings.component';
import { ReportMeetingComponent } from './features/meetings/components/report-meeting/report-meeting.component';
import { TasksComponent } from './features/tasks/components/tasks.component';
import { AssignTasksComponent } from './features/tasks/components/assign-tasks/assign-tasks.component';
import { WalletComponent } from './features/wallet/components/wallet.component';
import { AddWalletComponent } from './features/wallet/components/add-wallet/add-wallet.component';
import { ReportComponent } from './features/wallet/components/report/report.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  /// INICIO
  {
    path: 'dashboard',
    loadComponent: () => import('../app/features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Inicio',
    pathMatch: 'full'
  },

  /// REUNIONES
  {
    path: 'meetings',
    loadComponent: () => import('../app/features/meetings/components/meetings.component').then(m => m.MeetingsComponent),
    title: 'Reuniones',
    pathMatch: 'full'
  },
  {
    path: 'meetings/add-meetings',
    component: AddMeetingsComponent,
    title: 'Añadir reunion',
    pathMatch: 'full'
  },
  {
    path: 'meetings/:id/edit',
    component: AddMeetingsComponent,
    title: 'Editar reunion',
    pathMatch: 'full',
    data: { mode: 'edit' }
  },
  {
    path: 'meetings/:id/view',
    component: ReportMeetingComponent,
    title: 'Acta reunion',
    pathMatch: 'full'
  },
  /// TAREAS
  {
    path: 'tasks',
    loadComponent: () => import('../app/features/tasks/components/tasks.component').then(m => m.TasksComponent),
    title: 'Tareas',
    pathMatch: 'full'
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
    title: 'Ver tarea',
    pathMatch: 'full',
    data: { mode: 'view' }
  },
  /// CARTERA
  {
    path: 'wallet',
    loadComponent: () => import('../app/features/wallet/components/wallet.component').then(m => m.WalletComponent),
    title: 'Cartera',
    pathMatch: 'full'
  },
  {
    path: 'wallet/add-wallet',
    component: AddWalletComponent,
    title: 'Añadir cartera',
    pathMatch: 'full'
  },
  {
    path: 'wallet/:id/edit',
    component: AddWalletComponent,
    title: 'Editar cartera',
    pathMatch: 'full',
    data: { mode: 'edit' }
  },
  {
    path: 'wallet/:id/view',
    component: AddWalletComponent,
    title: 'Ver cartera',
    pathMatch: 'full',
    data: { mode: 'view' }
  },
  {
    path: 'wallet/report/:id',
    component: ReportComponent,
    title: 'Añadir pago',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'meetings' },
];
