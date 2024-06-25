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

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  filterForm: FormGroup;
  wallets: Wallet[] = []; // Aquí irán tus reuniones
  filteredWallets: Wallet[] = [];
  status: any[] = [];

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private statusService: StatusService
  ) {
    this.filterForm = this.fb.group({
      description: [''],
      status: this.fb.array([]), // Agregamos un campo para el estado
    });
  }

  ngOnInit(): void {
    this.getStatusWallet();
    this.getWallets();
  }

  getWallets(): void {
    // Aquí debes cargar las reuniones (puede ser una llamada a un servicio)
    this.walletService.getWallets().subscribe({
      next: (value) => {
        this.wallets = value.data;
        this.filteredWallets = this.wallets;
        this.applyFilters();
      },
      error: (err) => {},
    });
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

  setDefaultStatus(): void {
    const statusFormArray = this.filterForm.get('status') as FormArray;
    statusFormArray.clear();

    // Agregar los estados por defecto ("Creado" y "Realizado")
    this.status.forEach((state) => {
      if (
        state === 'Activa' ||
        state === 'Auditada' ||
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
}
