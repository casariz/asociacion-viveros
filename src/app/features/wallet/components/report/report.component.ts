import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TablePaymentsComponent } from '../table-payments/table-payments.component';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TablePaymentsComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  walletId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService,
    private datePipe: DatePipe
  ) {
    this.reportForm = this.fb.group({
      obligation_id: [{ value: '', disabled: true }],
      obligation_description: [{ value: '', disabled: true }],
      date_ini: [''],
      date_end: [''],
      paid: [''],
      observations: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.walletId = +id;
        this.loadWallet();
      }
    });
  }

  loadWallet(): void {
    if (this.walletId) {
      this.walletService.getWalletById(this.walletId).subscribe((wallet) => {
        const today = new Date();
        const date_ini = this.datePipe.transform(today, 'yyyy-MM-dd');
        let date_end: Date = new Date(today);
        
        if (wallet.obligation.quantity && wallet.obligation.period) {
          switch (wallet.obligation.period.toLowerCase()) {
            case 'año(s)':
              date_end.setFullYear(today.getFullYear() + wallet.obligation.quantity);
              break;
            case 'mes(es)':
              date_end.setMonth(today.getMonth() + wallet.obligation.quantity);
              
              break;
            case 'semana(s)':
              date_end.setDate(today.getDate() + (7 * wallet.obligation.quantity));
              break;
            case 'día(s)':
              date_end.setDate(today.getDate() + wallet.obligation.quantity);
              break;
            default:
              // Manejo de periodos desconocidos
              console.warn(`Periodo desconocido: ${wallet.obligation.period}`);
          }
        }

        const formatted_date_end = this.datePipe.transform(date_end, 'yyyy-MM-dd');

        this.reportForm.setValue({
          obligation_id: this.walletId,
          obligation_description: wallet.obligation.obligation_description,
          date_ini: date_ini,
          date_end: formatted_date_end,
          paid: '236000',
          observations: '',
        });
      });
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      return;
    }
    if (this.walletId !== null) {
      this.reportForm.get('obligation_id')?.enable();
      this.reportForm.patchValue({
        obligation_id: this.walletId,
      });
    }

    const reportData = this.reportForm.value;

    this.walletService.createPayment(reportData).subscribe(() => {
      this.router.navigate(['/wallet']); // Redirige a la lista de cartera
    });
  }
}
