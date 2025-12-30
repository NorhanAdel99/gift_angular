import { Component, inject, PLATFORM_ID, signal, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { sign } from 'crypto';
import { RouterLink } from "@angular/router";
import { Skeleton } from 'primeng/skeleton';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, Skeleton],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  contactData = signal<any>(null);

  categories = signal<any[]>([]);
  getContactInfo() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<any>('ContactInfo').subscribe({
      next: (res) => {
        console.log('ContactInfo response:', res?.data);
        this.contactData.set(res?.data);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching contact info:', err);
      }
    });
  }
  getCategoriesList() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<any>('ListCategories').subscribe({
      next: (res) => {
        console.log('CategoriesList response:', res?.data);
       this.categories.set(res?.data || []);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching categories list:', err);
      }
    });
  }

  ngOnInit() {
    this.getContactInfo();
    this.getCategoriesList();
  }
}

