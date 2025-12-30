import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';
import { AuthContainerComponent } from '../../../components/ui/authContainer/auth_container';
import { ImageUploadComponent } from '../../../components/Form/imgPrev/image-upload.component';

import { CityService, City } from '../../../services/city'; // import your service


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AuthContainerComponent,
    ImageUploadComponent
  ],
})
export class Register implements OnInit {

  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private router = inject(Router);
  private cityService = inject(CityService)

  loading = this.auth.loading;
  error = this.auth.error;



  cities: City[] = [];
  citiesLoading = false;
  image: string | null = null;

  registerForm = this.fb.nonNullable.group({
    Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
    // image: ['', Validators.required],


  });
  ngOnInit() {
    this.loadCities();
  }

  async loadCities() {
    // this.citiesLoading = true;
    await this.cityService.getCities();
    this.cities = this.cityService.cities(); // read signal value
    this.citiesLoading = false;
    console.log('Loaded cities:', this.cities);
  }

  async submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const rawValues = this.registerForm.getRawValue();

    const result = await this.auth.handleRegister({
      Phone: Number(rawValues.Phone),
      UserName: rawValues.UserName,
      Email: rawValues.Email,
      CityId: rawValues.city,

      image: this.image || null,
      // يجب إضافة هذا الجزء لأن الدالة في الـ Service تطلبه
      // Device: {
      //   DeviceId: 'some-id',    // يمكنك جلبه من الخدمة المختصة
      //   DeviceType: 'web',
      //   ProjectName: 'myApp'
      // }
      // إرسال البيانات كـ Flattened Keys
      "Device.DeviceId": "12345",
      "Device.DeviceType": "android",
      "Device.ProjectName": "test"
    });


    if (result.status === 'success') {
      this.router.navigateByUrl('/auth/otp');
    }

    if (result.status === 'needActive') {
      this.router.navigateByUrl('/auth/otp');
    }
  }

  onRemoveImage() {
    this.image = null;
  }

}
// export class Register implements OnInit {


// }