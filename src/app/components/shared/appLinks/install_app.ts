
import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'install-app',
  templateUrl: './install_app.html',
  standalone: true,
  imports: [ButtonModule, RouterLink]
})
export class installApp implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  appLinks = signal<any>(null);

  ngOnInit() {
    this.getAppLinks();
  }

  getAppLinks() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<any>('AppllictionLinks').subscribe({
      next: (res) => {
        console.log('AppLinks response:', res?.data);

        this.appLinks.set(res?.data || null);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching app links:', err);
      }
    });
  }


}
