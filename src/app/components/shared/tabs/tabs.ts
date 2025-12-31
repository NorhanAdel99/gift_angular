import { Component, Input, Output, EventEmitter , inject } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
 
@Component({
  selector: 'app-coupons-tabs',
  standalone: true,
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.css'],
  imports: [CommonModule, TranslateModule],
})
export class Tabs {
    private languageService = inject(LanguageService);
  @Input() coupons_type: boolean = false;
  @Input() coupons_status: boolean = false;

  @Input() type: string = '1';
  @Input() status: string = '1';

  @Output() typeChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  setType(value: string) {
    this.type = value;
    // this.typeChange.emit(value);
  }

  setStatus(value: string) {
    this.status = value;
    // this.statusChange.emit(value);
  }
    constructor() {
    this.languageService.init();
  }




 
}
