

import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';


import { CarouselBasicDemo } from '../../components/slider/slider';
import { ProductListComponent } from '../../components/products/product_list';
import { installApp } from '../../components/shared/appLinks/install_app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [ButtonModule, CarouselBasicDemo, ProductListComponent, installApp],
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private router = inject(Router);


  loading = signal(false);
  error = signal<string | null>(null);

  newCopons = signal<any[]>([]);
  mostSaleCopons = signal<any[]>([]);
  highRateCopons = signal<any[]>([]);
  closeProducts = signal<any[]>([]);
  theClosestCopons = signal<any[]>([]);
  sliders = signal<any[]>([]);
  ngOnInit() {
    this.getHomePage();
  }


  getHomePage() {
    this.loading.set(true);
    this.error.set(null);
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<any>('HomePage').subscribe({
      next: (res) => {
        console.log('HomePage response:', res?.data?.newCopon);
        this.sliders.set(res?.data?.sliders || []);
        this.newCopons.set(res?.data?.newCopon || []);
        this.mostSaleCopons.set(res?.data?.mostSaleCopons || []);
        this.highRateCopons.set(res?.data?.highRateCopons || []);
        this.theClosestCopons.set(res?.data?.theClosestCopons || []);


        this.closeProducts.set(res?.data?.closeProducts || []);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Something went wrong');
        this.loading.set(false);
      },
    });
  }

  // allProducts = [
  //   {
  //     id: 1, name: 'هدية فخمة', price: 150, image: 'assets/images/product.png', rate: 4,
  //     discountPercentage: 20,
  //     discountPercent: null
  //   },
  //   {
  //     id: 2, name: 'ساعة أنيقة', price: 300, image: 'assets/images/product.png', rate: 4,
  //     discountPercentage: 20,
  //     discountPercent: null
  //   },
  //   {
  //     id: 3, name: 'باقة ورد', price: 50, image: 'assets/images/product.png', rate: 4,
  //     discountPercentage: 20,
  //     discountPercent: null
  //   },
  //   {
  //     id: 4, name: 'باقة ورد', price: 50, image: 'assets/images/product.png', rate: 4,
  //     discountPercentage: 20,
  //     discountPercent: null
  //   },
  //   {
  //     id: 5, name: 'باقة ورد', price: 50, image: 'assets/images/product.png', rate: 4,
  //     discountPercentage: 20,
  //     discountPercent: null
  //   }
  // ];

}


