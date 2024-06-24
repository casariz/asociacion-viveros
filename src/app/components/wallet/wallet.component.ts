import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../interfaces/wallet';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  filterForm: FormGroup;
  wallets: Wallet[] = [];  // Aquí irán tus reuniones
  filteredWallets: Wallet[] = [];
  status: any[] = [];

  constructor(private fb: FormBuilder, 
    private walletService: WalletService, 
    private statusService: StatusService) {
    this.filterForm = this.fb.group({
      description: [''],
      status: [''] // Agregamos un campo para el estado
    });
  }

  ngOnInit(): void {
    this.getStatusWallet();
    this.getWallets();
  }

  getWallets(): void {
    // Aquí debes cargar las reuniones (puede ser una llamada a un servicio)
    this.walletService.getWallets().subscribe({
      next: (value)=> {
        this.wallets = value.data;
        this.filteredWallets = this.wallets;
      },
      error: (err)=> {
        
      },
    })
  }

  getStatusWallet(): void {
    this.statusService.getStatusWallets().subscribe({
      next:(value) => {
        this.status = value.status
      },
      error:(err) => {
        console.log("Error al traer status: ", err);
      },
    })
  }

  applyFilters(): void {
    const { description, status } = this.filterForm.value;
    this.filteredWallets = this.wallets.filter(wallet => {
      const matchesDescription = !description || wallet.obligation_description.toLowerCase().includes(description.toLowerCase());
      const matchesStatus = !status || wallet.status === status;

      return matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredWallets = this.wallets;
  }
}