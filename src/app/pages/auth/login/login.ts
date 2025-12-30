import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthStore } from '../../../store/auth.store';
import { AuthContainerComponent } from '../../../components/ui/authContainer/auth_container';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, AuthContainerComponent, RouterModule],
})
export class Login {
  private toastr = inject(ToastrService);
   private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
 


  loading = this.auth.loading;
  error = this.auth.error;

  loginForm = this.fb.nonNullable.group({
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
  });


  async submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const result = await this.auth.handleLogin({
      phone: Number(this.loginForm.value.phone),
    });

    if (result.status === 'success' || result.status === 'needActive') {
      this.router.navigateByUrl('/auth/otp');
      this.toastr.success(result.msg);
    } else if (result.status === 'error') {
      this.toastr.error(result.msg);
    }
  }
}
