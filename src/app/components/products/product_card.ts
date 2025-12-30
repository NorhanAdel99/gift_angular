import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coupon_card shadow-sm mb-4">
        <div class="contain_fav" (click)="product.fav = !product.fav">
         <img
          src="assets/images/Heart Angle.png"
          alt=""
        />
        </div>
        <img [src]="product.image" class="coupon_card_img" [alt]="product.coponName">
        <div class="p-2">
          <h5 class="card-title">{{ product.coponName }}</h5>
          <p class="card-text text-muted">{{ product.discount }}</p>
          <p>
           {{ product.startDate }}

          </p>
      
        </div>
    </div>
  `,
  styles: [`.card { border-radius: 15px; overflow: hidden; }`]
})
export class ProductCardComponent {
  @Input() product: any; // هنا بنستقبل بيانات المنتج من الأب
}