import { Component, Input } from '@angular/core';
import { LucideAngularModule, Search, Filter } from 'lucide-angular';

@Component({
  selector: 'app-section-header',
  imports: [LucideAngularModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css'
})
export class SectionHeaderComponent {
  readonly searchIcon = Search;
  readonly filterIcon = Filter;
  @Input() title: string = '';
}
