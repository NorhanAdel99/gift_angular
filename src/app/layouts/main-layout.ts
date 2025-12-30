import { Component } from '@angular/core';
import { RouterOutlet  } from '@angular/router';
import { HeaderComponent } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  template: `
    <app-header></app-header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `
})
export class MainLayoutComponent { }
