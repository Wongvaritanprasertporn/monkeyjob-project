import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  action = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.minLength(6)]],
      token: ['']
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.action == 1) {
        this.sendToken();
      } else {
        this.login();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  sendToken() {
    this.loading = true;
    this.api.post_('auth/forgot-password/admin', this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.action = 2;
        this.fun.presentAlert(response.message);
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  login() {
    this.loading = true;
    this.api.post_('auth/reset-password/admin', this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  navigate() {
    this.router.navigateByUrl('/dashboard');
  }

}
