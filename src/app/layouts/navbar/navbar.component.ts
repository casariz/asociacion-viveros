import { Component } from '@angular/core';
import { LucideAngularModule, Sprout } from 'lucide-angular';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly sprout = Sprout;
  constructor() {}
}
