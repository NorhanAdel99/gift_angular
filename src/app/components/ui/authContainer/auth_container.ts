import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  templateUrl: './auth-container.component.html',
  
})
export class AuthContainerComponent {
  @Input() auth: boolean = false;
}
