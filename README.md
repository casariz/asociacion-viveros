# Asovalvi - Sistema de Gestión para Asociación de Viveros

**Asovalvi** es un sistema de gestión integral desarrollado para automatizar y organizar las operaciones administrativas de una asociación de viveros. El sistema permite gestionar reuniones, tareas, cartera financiera y usuarios con diferentes roles de acceso.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

## Funcionalidades Principales

### 🏢 Gestión de Reuniones
- **Convocatoria de reuniones**: Creación de reuniones con fecha, hora, lugar, convocante, director y secretario
- **Orden del día**: Sistema para agregar temas categorizados (Orden del día, Desarrollo, Pendiente)
- **Gestión de asistentes**: Control de participantes con funciones de agregar/remover
- **Actas de reunión**: Generación automática de reportes profesionales con asistentes, temas y compromisos

### 📋 Sistema de Tareas
- **Asignación de tareas**: Creación de tareas vinculadas o independientes de reuniones
- **Seguimiento de compromisos**: Control de tiempo estimado, responsables y estado de avance
- **Estados de tarea**: Manejo de diferentes estados (Pendiente, Asignada, Completada, etc.)
- **Filtros avanzados**: Búsqueda por fechas, empleados, descripción y estado

### 💰 Módulo de Cartera
- **Gestión de obligaciones**: Registro de compromisos financieros con plazos y alertas
- **Control de pagos**: Sistema para reportar y hacer seguimiento de pagos realizados
- **Alertas automáticas**: Notificaciones previas al vencimiento de obligaciones
- **Reportes financieros**: Cálculo de totales y resúmenes de cartera

### 👥 Administración de Usuarios
- **Roles diferenciados**: Administrador, Secretario, Cartera, Asociado
- **Control de acceso**: Restricciones basadas en roles para diferentes funcionalidades
- **Registro de usuarios**: Sistema completo de registro con validaciones

## Características Técnicas

- **Framework**: Angular 18 con componentes standalone
- **Formularios**: Angular Reactive Forms con validaciones robustas
- **Ruteo**: Sistema de rutas protegidas con guards de autenticación y autorización
- **UI/UX**: Interfaz responsive con Bootstrap 5
- **Estado**: Gestión eficiente de estado entre componentes
- **API**: Integración con backend Laravel/PHP mediante servicios HTTP

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
