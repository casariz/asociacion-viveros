import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  filterForm: FormGroup;
  wallets: any[] = [];  // Aquí irán tus reuniones
  filteredWallets: any[] = [];
  concepts: any[] = [
    "Concept 1",
    "Concept 2"
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      description: [''],
      status: [''] // Agregamos un campo para el estado
    });
  }

  ngOnInit(): void {
    this.getWallets();
  }

  getWallets(): void {
    // Aquí debes cargar las reuniones (puede ser una llamada a un servicio)
    this.wallets = [
      // Ejemplo de reuniones
      { id: 1, reporter: 'John Doe', date: '2023-06-01', location: 'Nursery HQ', description: 'Discuss new planting plans', area: 'Landscaping', status: 'completed' },
      // Agrega más reuniones según sea necesario
    ];
    this.filteredWallets = this.wallets;
  }

  applyFilters(): void {
    const { description, status } = this.filterForm.value;

    this.filteredWallets = this.wallets.filter(wallet => {
      const matchesDescription = !description || wallet.description.toLowerCase().includes(description.toLowerCase());
      const matchesStatus = !status || wallet.status === status;

      return matchesDescription && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredWallets = this.wallets;
  }
}