import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { TablePaymentsComponent } from '../table-payments/table-payments.component';
import { ModalComponent } from '../../../../components/modal/modal.component';

@Component({
  selector: 'app-add-wallet',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TablePaymentsComponent, ModalComponent],
  templateUrl: './add-wallet.component.html',
  styleUrl: './add-wallet.component.css',
})
export class AddWalletComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  walletForm: FormGroup;
  walletId: number | null = null;
  isEditMode: boolean = false;
  isCreateMode: boolean = false;
  isReadOnly: boolean = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService
  ) {
    this.walletForm = this.fb.group({
      obligation_description: [
        { value: '', disabled: this.isReadOnly },
        Validators.required,
      ],
      obligation_id: [{ value: '', disabled: true }, Validators.required],
      quantity: [
        { value: '1', disabled: this.isReadOnly },
        Validators.required,
      ],
      period: [
        { value: 'Sin definir', disabled: this.isReadOnly },
        Validators.required,
      ],
      alert_time: [
        { value: '15', disabled: this.isReadOnly },
        Validators.required,
      ],
      observations: [
        { value: '', disabled: this.isReadOnly }
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const mode = this.route.snapshot.data['mode'];

      if (id) {
        this.walletId = +id;
        this.isEditMode = mode === 'edit';
        this.isReadOnly = mode === 'view';
        this.loadWallet();
      } else {
        this.isCreateMode = true;
      }
    });
  }

  loadWallet(): void {
    if (this.walletId) {
      this.walletService.getWalletById(this.walletId).subscribe((wallet) => {
        this.walletForm.patchValue(wallet.obligation);
      });
    }
    if (this.isReadOnly) {
      this.walletForm.disable();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.walletForm.controls;
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.walletForm.invalid || this.isReadOnly) {
      return;
    }
    
    if (this.walletId !== null) {
      this.walletForm.get('obligation_id')?.enable();
      this.walletForm.patchValue({
        obligation_id: this.walletId,
      });
    }

    const walletData = this.walletForm.value;

    if (this.isEditMode && this.walletId) {
      this.walletService
        .updateWallet(this.walletId, walletData)
        .subscribe(() => {
          this.onCloseModal();
        });
    } else {
      this.walletService.createWallet(walletData).subscribe(() => {
        this.onCloseModal();
      });
    }
  }
}
