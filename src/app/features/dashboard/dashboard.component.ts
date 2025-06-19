import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Users, CheckSquare, DollarSign, TrendingUp, Calendar, Clock, AlertTriangle } from 'lucide-angular';
import { MeetingsService } from '../meetings/services/meetings.service';
import { TaskService } from '../tasks/services/task.service';
import { WalletService } from '../wallet/services/wallet.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Estadísticas principales
  totalMeetings: number = 0;
  meetingsThisMonth: number = 0;
  totalTasks: number = 0;
  completedTasks: number = 0;
  walletTotal: number = 0;
  walletElements: number = 0;
  efficiency: number = 0;
  currentDate: string = new Date().toISOString();

  // Próximas reuniones
  upcomingMeetings: any[] = [];
  
  // Tareas pendientes
  pendingTasks: any[] = [];
  
  // Alertas
  expiredWalletItems: number = 0;
  upcomingMeetingsCount: number = 0;
  completedTasksCount: number = 0;

  // Lucide icons
  readonly users = Users;
  readonly checkSquare = CheckSquare;
  readonly dollarSign = DollarSign;
  readonly trendingUp = TrendingUp;
  readonly calendar = Calendar;
  readonly clock = Clock;
  readonly alertTriangle = AlertTriangle;

  constructor(
    private router: Router,
    private meetingsService: MeetingsService,
    private taskService: TaskService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadMeetingsData();
    this.loadTasksData();
    this.loadWalletData();
  }

  loadMeetingsData(): void {
    this.meetingsService.getMeetings(1).subscribe({
      next: (response) => {
        const meetings = response.data || [];
        this.totalMeetings = meetings.length;
        
        // Filtrar reuniones de este mes
        const currentMonth = new Date().getMonth();
        this.meetingsThisMonth = meetings.filter((meeting: any) => {
          const meetingDate = new Date(meeting.meeting_date);
          return meetingDate.getMonth() === currentMonth;
        }).length;

        // Próximas reuniones (próximas 3)
        this.upcomingMeetings = meetings
          .filter((meeting: any) => new Date(meeting.meeting_date) >= new Date())
          .sort((a: any, b: any) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
          .slice(0, 3);
        
        this.upcomingMeetingsCount = this.upcomingMeetings.length;
      },
      error: (err) => console.error('Error loading meetings:', err)
    });
  }

  loadTasksData(): void {
    this.taskService.getTasks(1).subscribe({
      next: (response) => {
        const tasks = response.data || [];
        this.totalTasks = tasks.length;
        
        // Tareas completadas
        this.completedTasks = tasks.filter((task: any) => task.status?.status === 1).length;
        this.completedTasksCount = this.completedTasks;
        
        // Calcular eficiencia
        this.efficiency = this.totalTasks > 0 ? Math.round((this.completedTasks / this.totalTasks) * 100) : 0;

        // Tareas pendientes (próximas 3)
        this.pendingTasks = tasks
          .filter((task: any) => task.status?.status !== 1) // No completadas
          .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3);
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  loadWalletData(): void {
    this.walletService.getWallets().subscribe({
      next: (response) => {
        const wallets = response.data || [];
        this.walletElements = wallets.length;
        
        // Calcular total de la cartera
        this.walletTotal = wallets.reduce((total: number, wallet: any) => {
          return total + (parseFloat(wallet.total_paid) || 0);
        }, 0);

        // Elementos vencidos (ejemplo: elementos con fecha de vencimiento pasada)
        this.expiredWalletItems = wallets.filter((wallet: any) => {
          if (wallet.expiration_date) {
            return new Date(wallet.expiration_date) < new Date();
          }
          return false;
        }).length;
      },
      error: (err) => console.error('Error loading wallet:', err)
    });
  }

  // Métodos de navegación
  navigateToMeetings(): void {
    this.router.navigate(['/meetings']);
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  navigateToWallet(): void {
    this.router.navigate(['/wallet']);
  }
  // Método para crear nueva reunión
  createMeeting(): void {
    this.router.navigate(['/meetings']);
  }

  // Método para crear nueva tarea
  createTask(): void {
    this.router.navigate(['/tasks']);
  }

  // Método para agregar a cartera
  addToWallet(): void {
    this.router.navigate(['/wallet']);
  }

  // Formatear fecha
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Formatear moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  // Obtener tiempo estimado de tarea
  getTaskTimeEstimate(task: any): string {
    if (task.estimated_time && task.units) {
      return `${task.estimated_time} ${task.units}`;
    }
    return '';
  }
}
