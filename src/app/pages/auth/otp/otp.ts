import { Component, ChangeDetectionStrategy, signal, viewChildren, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthContainerComponent } from '../../../components/ui/authContainer/auth_container';
import { AuthStore } from '../../../store/auth.store';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthContainerComponent],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Otp implements AfterViewInit {
  private Auth = inject(AuthStore);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  loading = signal(false);
  message = signal('');
  isSuccess = signal(false);

  timer = signal(60);
  timerRunning = signal(true);
  buttonDisabled = signal(true);
  isSpinning = signal(false);

  ngAfterViewInit() {
    this.inputs()[0]?.nativeElement.focus();
    this.startTimer();
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value && index < 3) {
      this.inputs()[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.inputs()[index].nativeElement.value && index > 0) {
      this.inputs()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const data = event.clipboardData?.getData('text').split('') || [];
    this.inputs().forEach((input, i) => {
      if (data[i]) input.nativeElement.value = data[i];
    });
    this.inputs()[Math.min(data.length, 3)].nativeElement.focus();
  }

  async verify() {
    const code = this.inputs().map(i => i.nativeElement.value).join('');

    if (code.length < 4) {
      this.message.set('الرجاء إدخال الرمز المكون من 4 أرقام');
      this.isSuccess.set(false);
      return;
    }

    this.loading.set(true);
    this.message.set('');

    const res = await this.Auth.handleVerification(code);

    this.loading.set(false);
    if (res.status === "success") {
      this.isSuccess.set(true);
      // this.message.set(res.msg);
      this.toastr.success(res.msg);

      // Success redirection
      this.router.navigate(['/']);
    } else if (res.status === "needCompleteInfo") {
      this.isSuccess.set(true);
      this.toastr.success(res.msg);

      this.router.navigate(['/complete-profile']);
    } else {
      this.isSuccess.set(false);
      this.toastr.error(res.msg);
    }
  }

  startTimer() {
    this.timerRunning.set(true);
    this.buttonDisabled.set(true);
    this.timer.set(60);
    const interval = setInterval(() => {
      this.timer.update(v => {
        if (v <= 1) {
          clearInterval(interval);
          this.timerRunning.set(false);
          this.buttonDisabled.set(false);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  resendCode() {
    if (this.buttonDisabled()) return;
    this.isSpinning.set(true);
    // Logic for resend API call would go here
    setTimeout(() => {
      this.isSpinning.set(false);
      this.startTimer();
    }, 1000);
  }
}