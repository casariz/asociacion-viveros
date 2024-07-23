import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../interfaces/wallet';
import { StatusService } from '../../services/status.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  filterForm: FormGroup;
  wallets: Wallet[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  filteredWallets: Wallet[] = [];
  status: any[] = [];
  userRole: string | null = '';

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private statusService: StatusService,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      description: [''],
      status: this.fb.array([]), // Agregamos un campo para el estado
    });
    
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getStatusWallet();
    this.getWallets(this.currentPage);
  }

  getWallets(page: number): void {
    // Aquí debes cargar las reuniones (puede ser una llamada a un servicio)
    this.walletService.getWallets().subscribe({
      next: (value) => {
        this.wallets = value.data;
        this.currentPage = value.current_page;
        this.totalPages = value.last_page;
        this.filteredWallets = this.wallets;
        this.applyFilters();
      },
      error: (err) => {},
    });
  }

  getUserRole():void{
    this.userRole = this.authService.getUserRole();
  }

  getStatusWallet(): void {
    this.statusService.getStatusWallets().subscribe({
      next: (value) => {
        this.status = value.status;
        this.setDefaultStatus();
        this.applyFilters();
      },
      error: (err) => {
        console.log('Error al traer status: ', err);
      },
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.getWallets(page);
    }
  }

  getPageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    // Agregar los estados por defecto ("Creado" y "Realizado")
    this.status.forEach((state) => {
      if (
        state === 'Activa' ||
        state === 'Pendiente' ||
        state === 'Vencida'
      ) {
        statusFormArray.push(this.fb.control(state));
      }
    });
  }

  applyFilters(): void {
    const { description, status } = this.filterForm.value;
    this.filteredWallets = this.wallets.filter((wallet) => {
      const matchesDescription =
        !description ||
        wallet.obligation_description
          .toLowerCase()
          .includes(description.toLowerCase());
      const matchesStatus =
        status.length === 0 || status.includes(wallet.status.description);

      return matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultStatus();
    this.filteredWallets = this.wallets;
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

  deleteWallet(id: number):void {
    this.walletService.deleteWallet(id).subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        console.log('Algo ha fallado:', err);
      },
    })
  }
}
