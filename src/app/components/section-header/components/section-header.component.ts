import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, Search, Filter } from 'lucide-angular';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css'
})
export class SectionHeaderComponent {
  readonly searchIcon = Search;
  readonly filterIcon = Filter;

  @Input() title: string = '';
  @Output() search = new EventEmitter<{ startDate: string; endDate: string; status: number; description: string }>();
  @Output() reset = new EventEmitter<void>();

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      description: ['']
    });
  }

  onSearch(): void {
    this.search.emit(this.filterForm.value);
  }

  onReset(): void {
    this.filterForm.reset();
    this.reset.emit();
  }
}
