
import {  inject, Injectable, signal, PLATFORM_ID,} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';

export interface VerificationResponse {
  status: 'success' | 'needCompleteInfo' | 'error';
  msg: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
   constructor() {
    this.initAuthState();
  }

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private cookie = inject(CookieService);


  // State Management 

  profile = signal<any>(null);
  phone = signal<string>(this.getInitialPhone());
  token = signal<string>('');
  isLoggedIn = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  private initAuthState() {
    if (!isPlatformBrowser(this.platformId)) return;

    const isLoggedInCookie = this.cookie.get('isLoggedIn');
    const token = this.cookie.get('token');
    const profile = this.cookie.get('profile');
    const phone = this.cookie.get('user_phone');

    if (isLoggedInCookie === 'true' && token) {
      this.isLoggedIn.set(true);
      this.token.set(token);
      this.phone.set(phone || '');

      if (profile) {
        try {
          this.profile.set(JSON.parse(profile));
        } catch {
          this.profile.set(profile);
        }
      }
    } else {
      this.isLoggedIn.set(false);
    }
  }


  // initial phone 
  private getInitialPhone(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.cookie.get('user_phone') || '';
    }
    return '';
  }

  /// convert  object to FormData
  private convertToFormData(data: any): FormData {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];

      if (value instanceof File || value instanceof Blob) {
        // if value is a file
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        // مثال: formData.append('Device', JSON.stringify(value));
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        // for primitive types
        formData.append(key, value.toString());
      }
    });

    return formData;
  }
  //// handle login 
  async handleLogin(data: { phone: number }) {
    this.loading.set(true);
    this.error.set(null);

    const formData = this.convertToFormData(data);


    const body = {
      phone: data.phone.toString(),
    };
    try {
      const res: any = await firstValueFrom(
        this.http.post('Login', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      return this.processResponse(res, data.phone.toString());
    } catch (error) {
      return this.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }

  //// handle register 
  async handleRegister(data: {
    Phone: number;
    UserName: string;
    Email: string;
    CityId: string;
    image?: any;
    "Device.DeviceId": string,
    "Device.DeviceType": string,
    "Device.ProjectName": string
  }) {
    this.loading.set(true);
    this.error.set(null);

    const formData = this.convertToFormData(data);

    try {
      const res: any = await firstValueFrom(
        this.http.post('Register', formData)
      );

      return this.processResponse(res, data.Phone.toString());
    } catch (error) {
      return this.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }

  private processResponse(res: any, phoneFromRequest: string) {
    const status = res.key;
    const msg = res.message;
    const data = res.data;

    // Even if it's 'needActive' or 'success', we save the phone number 
    // so the OTP screen knows which number to verify.
    if (status === 'success' || status === 'needActive') {
      if (isPlatformBrowser(this.platformId)) {
        // Save to cookie so it survives page refreshes
        this.cookie.set('user_phone', phoneFromRequest, 1); // expires in 1 day
      }
      this.phone.set(phoneFromRequest);
    }

    if (status === 'success') {
      
      if (isPlatformBrowser(this.platformId)) {
        this.cookie.set('isLoggedIn', 'true');
      }
      return { status: 'success', msg, data };
    }

    if (status === 'needActive') {
      return { status: 'needActive', msg, data };
    }

    return { status: 'error', msg };
  }

  private handleError(error: any) {
    const err = error as HttpErrorResponse;
    console.error('Auth Error:', err);
    const msg = err?.error?.message || 'An unexpected error occurred.';
    this.error.set(msg);
    return { status: 'error', msg };
  }
  ///// handle Verification 
  async handleVerification(code: string): Promise<VerificationResponse> {
    const currentPhone = this.phone() || this.cookie.get('user_phone');

    if (!currentPhone) {
      return { status: 'error', msg: 'Phone number not found. Please try logging in again.' };
    }


    const body = {
      code: code,
      phoneNumber: currentPhone,

      Device: {
        DeviceId: '12345',
        DeviceType: 'android',
        ProjectName: 'test'
      }
    };
    try {
      const res: any = await firstValueFrom(
        this.http.patch('ConfirmCode', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      const status = res.key;
      const msg = res.message;
      const data = res.data;

      if (status === "success" || status === "needCompleteInfo") {
        this.isLoggedIn.set(true);
        this.updateState(data);
        return { status, msg, data };
      }
      return { status: "error", msg };
    } catch (error: any) {
      const msg = error.error?.message || "An unexpected error occurred during verification.";
      return { status: "error", msg };
    }
  }
  ///// logout function
  async logout() {
    try {
      const res: any = await firstValueFrom(
        this.http.delete('Logout', {
          body: {
            deviceId: '12345',
          },
          headers: {
            Authorization: `Bearer ${this.token()}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const status = res.key;
      const msg = res.message;
      const data = res.data;

      if (status === 'success' || status === 'blocked' || status === 'unauthenticated') {
        if (isPlatformBrowser(this.platformId)) {
          this.cookie.delete('isLoggedIn');
          this.cookie.delete('profile');
          this.cookie.delete('token');
          this.cookie.delete('user_phone');
        }

        this.isLoggedIn.set(false);
        this.token.set('');
        this.profile.set(null);
        this.phone.set('');

        return { status, msg, data };
      }

      return { status: 'error', msg };
    } catch (error: any) {
      const msg = error.error?.message || 'Logout failed';
      return { status: 'error', msg };
    }
  }

  private updateState(data: any) {
    // this.profile.set(data.data);
    this.cookie.set('profile', JSON.stringify(data));
    this.cookie.set('token', data.token);
    this.profile.set(data);

    this.phone.set(data.phoneNumber);
    this.token.set(data.token);
    this.isLoggedIn.set(true);
    // this.token.set()
    // localStorage.setItem("token", data.token);
  }
}
