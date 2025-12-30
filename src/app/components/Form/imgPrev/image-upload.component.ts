import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnChanges {
  /* ========== Inputs (props) ========== */
  @Input() modelValue!: string | null;
  @Input() id!: string;
  @Input() name!: string;
  @Input() index!: number;
  @Input() multiple = false;
  @Input() edit = false;
  @Input() upload = false;
  @Input() imageUrl = '';
  @Input() newImages = '';
  @Input() commercial_register_copy = false;

  /* ========== Outputs (emits) ========== */
  @Output() modelValueChange = new EventEmitter<string | null>();
  @Output() updateMyImgs = new EventEmitter<string>();
  @Output() updateMyImgs2 = new EventEmitter<string>();
  @Output() removeImageEvent = new EventEmitter<void>();

  previewImage: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelValue']) {
      this.previewImage = this.modelValue;
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!this.validateImageFile(file)) {
      console.error('Invalid file type');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      this.updateMyImgs.emit(this.previewImage);
      this.modelValueChange.emit(this.previewImage);
    };
    reader.readAsDataURL(file);
  }

  validateImageFile(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
    ];
    return allowedTypes.includes(file.type);
  }

  removeImage() {
    this.previewImage = null;
    this.modelValueChange.emit(null);
    this.removeImageEvent.emit();
  }
}
