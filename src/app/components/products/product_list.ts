import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product_card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="row">
      @for (item of products; track item.id) {
        <div class="col-md-3 col-sm-6">
          <app-product-card [product]="item"></app-product-card>
        </div>
      }
    </div>
  `
})
export class ProductListComponent {
  @Input() products: any[] = [];
}