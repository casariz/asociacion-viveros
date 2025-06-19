import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, TriangleAlert, XCircle, Plus } from 'lucide-angular';
import { Wallet } from '../interfaces/wallet';
import { WalletService } from '../services/wallet.service';
import { StatusService } from '../../../services/status.service';
import { SectionHeaderComponent } from '../../../components/section-header/components/section-header.component';
import { DataTableComponent } from '../../../components/data-table/components/data-table.component';
import { Column } from '../../../components/data-table/interfaces/data-table';
import { TablePaymentsComponent } from './table-payments/table-payments.component';
import { AddWalletComponent } from './add-wallet/add-wallet.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule, SectionHeaderComponent, DataTableComponent, TablePaymentsComponent, AddWalletComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  filterForm: FormGroup;
  wallets: Wallet[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  filteredWallets: Wallet[] = [];
  status: any[] = [];
  userRole: string | null = '';
  payments: any[] = [];
  isAddWalletModalOpen: boolean = false;

  // Lucide icons
  readonly checkCircle = CheckCircle;
  readonly triangleAlert = TriangleAlert;
  readonly xCircle = XCircle;
  readonly plus = Plus; // Icon for adding wallets

  columns: Column[] = [
    { key: 'status_icon', label: '' },
    { key: 'obligation_id', label: 'ID' },
    { key: 'obligation_description', label: 'DESCRIPCIÓN' },
    { key: 'period_info', label: 'PERIODO [ALERTA]' },
    { key: 'expiration_info', label: 'VENCE - ÚLTIMO REPORTE' },
    { key: 'observations', label: 'OBSERVACIONES' },
    { key: 'total_paid', label: 'TOTAL' },
    { key: 'acciones', label: 'ACCIONES' }
  ];

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private statusService: StatusService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      description: [''],
      status: this.fb.array([]),
    });

  }

  ngOnInit(): void {
    this.getUserRole();
    this.getStatusWallet();
    this.getWallets(this.currentPage);
  }

  getWallets(page: number): void {
    this.walletService.getWallets().subscribe({
      next: (response) => {
        // Handle both array response and paginated response
        if (Array.isArray(response)) {
          this.wallets = response;
          this.currentPage = page;
          this.totalPages = Math.ceil(response.length / this.itemsPerPage);
        } else {
          this.wallets = response.data || response;
          this.currentPage = response.current_page || page;
          this.totalPages = response.last_page || Math.ceil(this.wallets.length / this.itemsPerPage);
        }
        console.log('Wallets obtenidos:', this.wallets);

        this.filteredWallets = this.wallets;
        this.applyFilters();
      },
      error: (err) => {
        console.log('Error al cargar wallets:', err);
      },
    });
  }

  getUserRole(): void {
    // Get user role from localStorage or set default
    this.userRole = localStorage.getItem('userRole') || 'Usuario';
  }

  getStatusWallet(): void {
    this.statusService.getStatusWallets().subscribe({
      next: (response) => {
        // Handle both array response and object response
        this.status = Array.isArray(response) ? response : (response.status || []);
        this.setDefaultStatus();
        this.applyFilters();
      },
      error: (err) => {
        console.log('Error al traer status: ', err);
      },
    });
  }

  private getPeriodInfo(wallet: any): string {
    return `${wallet.period} [${wallet.alert_time} días]`;
  }

  private getExpirationInfo(wallet: any): string {
    const expiration = wallet.expiration_date ? new Date(wallet.expiration_date).toLocaleDateString() : 'Sin fecha';
    const lastPayment = wallet.last_payment ? `$${wallet.last_payment}` : 'Sin pagos';
    return `${expiration} - ${lastPayment}`;
  }

  private formatCurrency(value: any): string {
    if (!value) return '$0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `$${numValue.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  changePage(page: number): void {
    // Validar que la página esté dentro del rango válido
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log(`Cambiando a página ${page} de ${this.totalPages}`);
      console.log(`Mostrando elementos del ${(page - 1) * this.itemsPerPage + 1} al ${Math.min(page * this.itemsPerPage, this.filteredWallets.length)} de ${this.filteredWallets.length}`);
    }
  }

  getPageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    const defaultStatusIds = [10, 12, 13]; // Realizado, Vencida, Activa
    defaultStatusIds.forEach((statusId) => {
      statusFormArray.push(this.fb.control(statusId));
    });
  }

  applyFilters(): void {
    const { startDate, endDate, description, status } = this.filterForm.value;
    this.filteredWallets = this.wallets.filter((wallet) => {
      const walletStartDate = !startDate || new Date(wallet.expiration_date) >= new Date(startDate);
      const walletEndDate = !endDate || new Date(wallet.expiration_date) <= new Date(endDate);
      const walletDescription =
        !description ||
        wallet.obligation_description
          .toLowerCase()
          .includes(description.toLowerCase());

      // Handle status filtering - wallet.status is a number
      let walletStatus = true;
      if (status && status.length > 0) {
        walletStatus = status.includes(wallet.status);
      }

      return walletStartDate && walletEndDate && walletDescription && walletStatus;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredWallets.length / this.itemsPerPage);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultStatus();
    this.filteredWallets = this.wallets;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredWallets.length / this.itemsPerPage);
  }

  get statusFormArray() {
    return this.filterForm.get('status') as FormArray;
  }

  onStatusChange(event: any, state: string): void {
    const statusFormArray = this.statusFormArray;
    if (event.target.checked) {
      statusFormArray.push(this.fb.control(state));
    } else {
      const index = statusFormArray.controls.findIndex(
        (x) => x.value === state
      );
      statusFormArray.removeAt(index);
    }
    this.applyFilters();
  }

  deleteWallet(id: number): void {
    this.walletService.deleteWallet(id).subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        console.log('Algo ha fallado:', err);
      },
    })
  }
  // Methods for data table integration
  get paginatedWallets(): any[] {
    // Calcular el total de páginas
    this.totalPages = Math.ceil(this.filteredWallets.length / this.itemsPerPage);

    // Calcular el índice de inicio y fin para la página actual
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Obtener los elementos de la página actual
    const pageItems = this.filteredWallets.slice(startIndex, endIndex);

    // Transformar los datos para la tabla
    return pageItems.map(wallet => ({
      ...wallet,
      status_icon: this.getStatusIcon(wallet.status),
      period_info: this.getPeriodInfo(wallet),
      expiration_info: this.getExpirationInfo(wallet),
      total_paid: this.formatCurrency(wallet.total_paid),
      fechaLugar: `${wallet.expiration_date || 'Sin fecha'} - ${wallet.server_name || 'Sin lugar'}`,
      acciones: wallet.obligation_id
    }));
  }

  getStatusIcon(status: any): any {
    const statusId = typeof status === 'object' ? status.status_id : status;
    switch (statusId) {
      case 9: return { icon: this.checkCircle, color: '#ffffff' };
      case 10: return { icon: this.checkCircle, color: '#009900' };
      case 12: return { icon: this.triangleAlert, color: '#FF9966' };
      default: return { icon: this.xCircle, color: '#AA0000' };
    }
  }

  handleTableAction(action: string, walletId: number): void {
    switch (action) {
      case 'edit':
        this.router.navigate(['/wallet', walletId, 'edit']);
        break;
      case 'view':
        this.router.navigate(['/wallet', walletId, 'view']);
        break;
      case 'report':
        this.router.navigate(['/wallet', 'report', walletId]);
        break;
      case 'delete':
        this.deleteWallet(walletId);
        break;
      case 'payments':
        this.viewPayments(walletId);
        break;
    }
  }

  viewPayments(walletId: number): void {
    this.walletService.getPayment(walletId).subscribe({
      next: (response) => {
        this.payments = response.payments;
      },
      error: (err) => {
        console.log('Error al cargar pagos:', err);
      }
    });
  }

  closePaymentsModal(): void {
    this.payments = [];
  }

  getTotalPaid(): number {
    return this.filteredWallets.reduce((acc, wallet) => {
      const totalPaid = typeof wallet.total_paid === 'string'
        ? parseFloat(wallet.total_paid) || 0
        : wallet.total_paid || 0;
      return acc + totalPaid;
    }, 0);
  }

  openAddWalletModal(): void {
    this.isAddWalletModalOpen = true;
  }

  closeAddWalletModal(): void {
    this.isAddWalletModalOpen = false;
    this.getWallets(this.currentPage); // Refresh the list after closing modal
  }
}
