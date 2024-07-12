import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table-payments',
  standalone: true,
  imports: [],
  templateUrl: './table-payments.component.html',
  styleUrl: './table-payments.component.css',
})
export class TablePaymentsComponent implements OnInit {
  payments: any[] = [];
  walletId: number | null = null;

  constructor(
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.walletId = +id;
        this.loadPayments();
      }
    });
  }

  loadPayments(): void {
    if (this.walletId) {
      this.walletService.getPayment(this.walletId).subscribe((payment) => {
        this.payments = payment.payments;
      });
    }
  }
}
