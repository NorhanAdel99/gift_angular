import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive , Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthStore } from '../../store/auth.store';


@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: true,


})
export class HeaderComponent {

    private toastr = inject(ToastrService);
   private router = inject(Router);



  private auth = inject(AuthStore);
  isLoggedIn = this.auth.isLoggedIn();
  menuOpen = false;
  profile = this.auth.profile;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // logout() {
  //   this.auth.logout();
  //    if (status === 'success' || status === 'blocked' || status === 'unauthenticated') {

  //     this.toastr.success('تم تسجيل الخروج بنجاح', 'نجاح');
  //     this.router.navigateByUrl('/login');
  //   } else {
  //     this.toastr.error('حدث خطأ أثناء تسجيل الخروج', 'خطأ');
  //   }
  // }


    async logout() {
 
    const result = await this.auth.logout();

    if (result.status === 'success' || result.status === 'needActive') {
      this.toastr.success(result.msg);
      this.router.navigateByUrl('/auth/login');
    } else if (result.status === 'error') {
      this.toastr.error(result.msg);
    }
  }


   checkLogin(path: string) {
    if (!this.auth.isLoggedIn()) {

      this.toastr.warning(
        'من فضلك سجّل الدخول أولاً',
        'تنبيه'
      );
      return;
    }

    this.router.navigateByUrl(path);
  }

}





