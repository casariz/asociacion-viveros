import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../../ui/card/card.component';
import { Column } from '../interfaces/data-table';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CardComponent, CommonModule, LucideAngularModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage: string = 'No hay datos disponibles.';
  @Input() showTotal: boolean = false;
  @Input() totalValue: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() viewItem = new EventEmitter<number>();
  @Output() editItem = new EventEmitter<number>(); // Added for edit action
  @Output() completeItem = new EventEmitter<number>(); // Added for complete action
  @Output() rejectItem = new EventEmitter<number>(); // Added for reject action
  @Output() paymentsItem = new EventEmitter<number>(); // Added for payments action

  onView(itemId: number): void {
    this.viewItem.emit(itemId);
  }

  onEdit(itemId: number): void { // Added handler for edit
    this.editItem.emit(itemId);
  }

  onComplete(itemId: number): void { // Added handler for complete
    this.completeItem.emit(itemId);
  }
  onReject(itemId: number): void { // Added handler for reject
    this.rejectItem.emit(itemId);
  }

  onPayments(itemId: number): void { // Added handler for payments
    this.paymentsItem.emit(itemId);
  }
}
