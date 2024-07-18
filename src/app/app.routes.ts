import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { AddMeetingsComponent } from './components/meetings/add-meetings/add-meetings.component';
import { AssignTasksComponent } from './components/assign-tasks/assign-tasks.component';
import { AddWalletComponent } from './components/wallet/add-wallet/add-wallet.component';
import { authGuard } from './services/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ReportComponent } from './components/wallet/report/report.component';
import { UsersComponent } from './components/users/users.component';
import { EditUsersComponent } from './components/users/edit-users/edit-users.component';
import { roleGuard } from './services/role.guard';
import { ReportMeetingComponent } from './components/meetings/report-meeting/report-meeting.component';

export const routes: Routes = [
  ///LOGUEO
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registrarse',
    pathMatch: 'full'
  },
  /// REUNIONES
  {
    path: 'meetings',
    component: MeetingsComponent,
    title: 'Reuniones',
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'meetings/add-meetings',
    component: AddMeetingsComponent,
    title: 'Añadir reunion',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['Administrador(a)', 'Secretario(a)'] }
  },
  {
    path: 'meetings/:id/edit',
    component: AddMeetingsComponent,
    title: 'Editar reunion',
    pathMatch: 'full',
    data: { mode: 'edit', expectedRoles: ['Administrador(a)', 'Secretario(a)']},
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'meetings/:id/view',
    component: ReportMeetingComponent,
    title: 'Acta reunion',
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  /// TAREAS
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Tareas',
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',
    component: AssignTasksComponent,
    title: 'Asignar tarea',
    pathMatch: 'full',
    data: { mode: 'create', expectedRoles: ['Administrador(a)', 'Secretario(a)'] },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: AssignTasksComponent,
    title: 'Editar tarea',
    pathMatch: 'full',
    data: { mode: 'edit', expectedRoles: ['Administrador(a)', 'Secretario(a)'] },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'tasks/:id/view',
    component: AssignTasksComponent,
    title: 'Ver tarea',
    pathMatch: 'full',
    data: { mode: 'view' },
    canActivate: [authGuard]
  },
  /// CARTERA
  {
    path: 'wallet',
    component: WalletComponent,
    title: 'Cartera',
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'wallet/add-wallet',
    component: AddWalletComponent,
    title: 'Añadir cartera',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: {expectedRoles: ['Administrador(a)', 'Secretario(a)', 'Cartera']}
  },
  {
    path: 'wallet/:id/edit',
    component: AddWalletComponent,
    title: 'Editar cartera',
    pathMatch: 'full',
    data: { mode: 'edit', expectedRoles: ['Administrador(a)', 'Secretario(a)', 'Cartera',] },
    canActivate: [authGuard,roleGuard]
  },
  {
    path: 'wallet/:id/view',
    component: AddWalletComponent,
    title: 'Ver cartera',
    pathMatch: 'full',
    data: { mode: 'view' },
    canActivate: [authGuard]
  },
  {
    path: 'wallet/report/:id',
    component: ReportComponent,
    title: 'Añadir pago',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: {expectedRoles: ['Administrador(a)', 'Secretario(a)', 'Cartera']}
  },
  //USUARIOS
  {
    path: 'users',
    component: UsersComponent,
    title: 'Usuarios',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: {expectedRoles: ['Administrador(a)']}
  },
  {
    path: 'users/:id/edit',
    component: EditUsersComponent,
    title: 'Editar usuario',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: {expectedRoles: ['Administrador(a)']}
  }
];
