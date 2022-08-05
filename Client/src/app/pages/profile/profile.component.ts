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
      company: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      phone: ['', [Validators.required]],
      website: ['', [Validators.required]],
      team_size: ['', [Validators.required]],
      company_description: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });

    if (this.auth.user.company) {
      this.form.get('company').setValue(this.auth.user.company);
    }
    if (this.auth.user.email) {
      this.form.get('email').setValue(this.auth.user.email);
    }
    if (this.auth.user.phone) {
      this.form.get('phone').setValue(this.auth.user.phone);
    }
    if (this.auth.user.website) {
      this.form.get('website').setValue(this.auth.user.website);
    }
    if (this.auth.user.team_size) {
      this.form.get('team_size').setValue(this.auth.user.team_size);
    }
    if (this.auth.user.company_description) {
      this.form.get('company_description').setValue(this.auth.user.company_description);
    }
    if (this.auth.user.country) {
      this.form.get('country').setValue(this.auth.user.country);
    }
    if (this.auth.user.city) {
      this.form.get('city').setValue(this.auth.user.city);
    }
    if (this.auth.user.address) {
      this.form.get('address').setValue(this.auth.user.address);
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
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert('Profile has been updated.');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }
}