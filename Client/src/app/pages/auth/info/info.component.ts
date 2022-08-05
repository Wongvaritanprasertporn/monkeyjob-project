import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  user_type = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      company: [''],
    });

    this.user_type = this.auth.user.user_type ? this.auth.user.user_type : 1;
    this.form.get('name').setValue(this.auth.user.name);
    this.form.get('company').setValue(this.auth.user.company);
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

    if(this.user_type == 2 && !this.form.value.company) {
      this.fun.presentAlertError("Company name is required.");
      return;
    }

    this.loading = true;
    this.form.value.user_type = this.user_type;
    this.api.put(`authenticated/users/`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.auth.setLogin(response);
        if(this.user_type == 1) {
          this.router.navigateByUrl('/uploads');
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getUserType(e: any) {
    this.user_type = e;
  }

}