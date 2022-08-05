import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  phone: string | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      company: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      is_2factor_auth_enabled: [''],
    });

    if (this.auth.user.name) {
      this.form.get('name').setValue(this.auth.user.name);
    }
    if (this.auth.user.email) {
      this.form.get('email').setValue(this.auth.user.email);
    }
    if (this.auth.user.company) {
      this.form.get('company').setValue(this.auth.user.company);
    }

    if (this.auth.user.phone) {
      this.form.get('phone').setValue(this.auth.user.phone);
    }

    this.form.get('is_2factor_auth_enabled').setValue(this.auth.user.is_2factor_auth_enabled);

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
    this.api.put(`authenticated/admin`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert('Profile has been updated.');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }
}