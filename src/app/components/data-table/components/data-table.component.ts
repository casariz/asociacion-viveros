import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../../ui/card/card.component';
import { Column } from '../interfaces/data-table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CardComponent, CommonModule],
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

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() viewItem = new EventEmitter<number>(); // Nuevo para manejar acciones

  onView(itemId: number) {
    this.viewItem.emit(itemId);
  }
}
