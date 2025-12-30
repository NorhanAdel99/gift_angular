import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ToastModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
}