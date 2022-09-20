import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  phone: string | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      phone: ['', [Validators.required]],
      introduce: ['', [Validators.required]],
      record: ['', [Validators.required]],
    });

    if (this.auth.user.name) {
      this.form.get('name').setValue(this.auth.user.name);
    }
    if (this.auth.user.email) {
      this.form.get('email').setValue(this.auth.user.email);
    }
    if (this.auth.user.phone) {
      this.form.get('phone').setValue(this.auth.user.phone);
    }
    if (this.auth.user.resume) {
      this.form.get('introduce').setValue(this.auth.user.resume);
    }
    if (this.auth.user.summary) {
      this.form.get('record').setValue(this.auth.user.summary);
    }
    this.form.markAsDirty();
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.update();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  update() {
    this.loading = true;
    this.api.put(`authenticated/users`, this.form.value)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.auth.user = response.user;
        this.fun.presentAlert('Profile has been updated.');
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}