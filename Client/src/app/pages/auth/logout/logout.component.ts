import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FunctionsService } from '../../../services/functions.service';
import { Router } from '@angular/router';
import { SocialAuthService } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  loading: boolean | undefined;
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router,
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    if (this.auth.user.login_method == "Google") {
      this.signOut();
    } else {
      this.logout();
    }
  }

  logout() {
    this.loading = false;
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  signOut(): void {
    var el = this;
    el.authService.signOut();
    const myInterval = setInterval(function () {
      el.logout();
      clearInterval(myInterval);
    }, 2000);
  }

}
