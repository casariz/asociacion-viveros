import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

  onSectionChange(sectionId: string) {
    this.router.navigate([this.navItems.find(item => item.id === sectionId)?.path || '']);
    this.sectionChange.emit(sectionId);
  }


}
