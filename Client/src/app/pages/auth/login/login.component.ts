import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService,GoogleLoginProvider } from "@abacritt/angularx-social-login";

import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any;
  _2form: any;
  loading: boolean | undefined;
  phone: string | undefined;
  action = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private authService: SocialAuthService
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]]
    });

    this._2form = this.formBuilder.group({
      token: ['', [Validators.required]]
    });

    this.authService.authState.subscribe((user) => {
      if (user && !this.loading) {
        this.form.value.email = user.email;
        this.google(user);
      }
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.action == 1) {
        this.login();
      } else {
        this._2factor();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  login() {
    this.loading = true;
    this.api.post_('auth/users', this.form.value)
      .subscribe({next: (response: any) => {
        console.log(response.user)
        this.loading = false;
        if (response.is_2factor_auth_enabled) {
          this.action = 2;
        } else {
          this.auth.setLogin(response);
          this.navigate();
        }
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  _2factor() {
    this.loading = true;
    this.api.post_('auth/verify/users', {
      email: this.form.value.email,
      token: this._2form.value.token
    })
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  google(data: any) {
    this.loading = true;
    this.api.post_('auth/google/users', {
      name: data.name,
      email: data.email
    })
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      }, error: (e) => {
        this.loading = false;
        this.authService.signOut();
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  navigate() {
    console.log(this.auth.user.user_type)
    if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }
  }
}