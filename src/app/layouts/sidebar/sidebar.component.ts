import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() navItems: any[] = [];
  @Input() activeSection!: string;
  @Output() sectionChange = new EventEmitter<string>();


  onSectionChange(sectionId: string) {
    this.sectionChange.emit(sectionId);
  }
}
