import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-add-wallet',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-wallet.component.html',
  styleUrl: './add-wallet.component.css'
})
export class AddWalletComponent implements OnInit {
  walletForm: FormGroup;
  walletId: number | null = null;
  isEditMode: boolean = false;
  isCreateMode: boolean = false;
  isReadOnly: boolean = false;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private walletService: WalletService
  ){
    this.walletForm = this.fb.group({
      obligation_description: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      quantity: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      period: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      alert_time: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      created_by: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      observations: [{ value: '', disabled: this.isReadOnly }, Validators.required]
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const mode = this.route.snapshot.data['mode'];

      if (id) {
        this.walletId = +id;
        this.isEditMode = mode === 'edit';
        this.loadWallet();
      } else {
        this.isCreateMode = true;
      }
    });
  }

  loadWallet():void {
    if(this.walletId){
      this.walletService.getWalletById(this.walletId).subscribe((wallet) => {
        console.log(wallet.obligation)
        this.walletId = wallet.obligation.obligation_id;
        this.walletForm.patchValue(wallet.obligation)
      })
    }
  }

  onSubmit():void{

  }
}
