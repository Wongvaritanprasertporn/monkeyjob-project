import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  regex_char: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  regex_small_az: RegExp = /[a-z]/
  regex_cap_az: RegExp = /[A-Z]/
  regex_num: RegExp = /[0-9]/
  form: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]]
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.updatePassword();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  updatePassword() {
    this.loading = true;
    this.api.put('authenticated/users/password', this.form.value)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.form.reset();
        this.fun.presentAlert("Password has been updated.");
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

}