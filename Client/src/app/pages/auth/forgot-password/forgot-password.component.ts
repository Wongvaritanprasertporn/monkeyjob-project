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

  hasUpperCase = false;
  hasLowerCase = false;
  hasNumeric = false;
  hasChar = false;

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
      password: ['', [Validators.minLength(8), Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/),]],
      conPassword: ['', [Validators.minLength(8), Validators.required]],
      token: ['', [Validators.required]]
    });
  }

  passwordValidation(password: any) {
    const hasUpperCase = /[A-Z]+/.test(password)
    const hasLowerCase = /[a-z]+/.test(password)
    const hasNumeric = /[0-9]+/.test(password)
    const hasChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)

    this.hasUpperCase = hasUpperCase
    this.hasLowerCase = hasLowerCase
    this.hasNumeric = hasNumeric
    this.hasChar = hasChar
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
        this.login();
      } else {
        for (let i in this.pwdForm.controls)
          this.pwdForm.controls[i].markAsTouched();
      }
    }
  }

  sendToken() {
    this.loading = true;
    this.api.post_('auth/forgot-password/users', [this.form.value.email])
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
    this.api.post_('auth/reset-password/users', { email: this.form.value['email'], password: this.pwdForm.value['password'], token: this.pwdForm.value['token'] })
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
