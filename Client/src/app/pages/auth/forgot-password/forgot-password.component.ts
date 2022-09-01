import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, Form } from '@angular/forms';
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

  regex_char: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  regex_small_az: RegExp = /[a-z]/
  regex_cap_az: RegExp = /[A-Z]/
  regex_num: RegExp = /[0-9]/

  form: any;
  pwdForm: any;

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
    });

    this.pwdForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.minLength(8), Validators.required]],
      conPassword: ['', [Validators.minLength(8), Validators.required]],
      token: ['', [Validators.required]]
    });
  }

  makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  submit() {
    if (this.action == 1) {
      if (this.form.dirty && this.form.valid) {
        this.sendToken();
      } else {
        for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
      }
    } else {
      if (this.pwdForm.dirty && this.pwdForm.valid) {
        this.pwdForm["email"].value = this.form["email"].value;
        this.login();
      } else {
        for (let i in this.pwdForm.controls)
        this.pwdForm.controls[i].markAsTouched();
      }
    }
  }

  sendToken() {
    this.loading = true;
    this.api.post_('auth/forgot-password/users', this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.action = 2;
          this.fun.presentAlert(response.message);
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  login() {
    this.loading = true;
    this.api.post_('auth/reset-password/users', this.pwdForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.auth.setLogin(response);
          this.navigate();
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  navigate() {
    if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }
  }

}
