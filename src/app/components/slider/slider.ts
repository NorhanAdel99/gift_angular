import { Component, OnInit, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';


export interface Slider {
    id: number;
    image: string;
    name: string;
    price: number;
    inventoryStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

@Component({
    styleUrl: './slider.css',
    selector: 'app-carousel',
    standalone: true,
    templateUrl: '../slider/slider.html',
    imports: [CarouselModule, ButtonModule, TagModule]
})
export class CarouselBasicDemo implements OnInit {

    // sliders: Slider[] = [];
    responsiveOptions: any[] = [];

    ngOnInit() {
        // this.sliders = [
        //     {
        //         id: 1,
        //         image: 'https://picsum.photos/600/300?random=1',
        //         name: 'هدية رومانسية',
        //         price: 250,
        //         inventoryStatus: 'In Stock'
        //     },
        //     {
        //         id: 2,
        //         image: 'https://picsum.photos/600/300?random=2',
        //         name: 'بوكس شوكولاتة',
        //         price: 180,
        //         inventoryStatus: 'Low Stock'
        //     },
        //     {
        //         id: 3,
        //         image: 'https://picsum.photos/600/300?random=3',
        //         name: 'دبدوب كبير',
        //         price: 320,
        //         inventoryStatus: 'In Stock'
        //     },
        //     {
        //         id: 4,
        //         image: 'https://picsum.photos/600/300?random=4',
        //         name: 'كارت تهنئة',
        //         price: 50,
        //         inventoryStatus: 'Out of Stock'
        //     }
        // ];

        this.responsiveOptions = [
            { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
            { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
            { breakpoint: '767px', numVisible: 1, numScroll: 1 }
        ];
    }
    getSeverity(status: string) {
        switch (status) {
            case 'In Stock':
                return 'success';
            case 'Low Stock':
                return 'warning';
            case 'Out of Stock':
                return 'danger';
            default:
                return 'info';
        }
    }
    @Input() sliders: any;
}
