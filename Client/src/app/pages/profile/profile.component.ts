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
      business: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      phone: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });

    if (this.auth.user.business) {
      this.form.get('business').setValue(this.auth.user.business);
    }
    if (this.auth.user.email) {
      this.form.get('email').setValue(this.auth.user.email);
    }
    if (this.auth.user.phone) {
      this.form.get('phone').setValue(this.auth.user.phone);
    }
    if (this.auth.user.company_description) {
      this.form.get('description').setValue(this.auth.user.company_description);
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
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.fun.presentAlert('Profile has been updated.');
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}