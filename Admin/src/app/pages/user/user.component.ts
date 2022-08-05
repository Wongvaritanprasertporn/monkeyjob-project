import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  user: any = {
    id: ""
  };
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      // company: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      user_type: [1, Validators.required],
      // team_size: ['', Validators.required],
      address: ['', Validators.required],
      password: [''],
    });

    if (this.activatedRoute.snapshot.paramMap.get('user_id')) {
      this.getUser(this.activatedRoute.snapshot.paramMap.get('user_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.user.id) {
        this.update();
      } else {
        this.save();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;
    this.api.post_(`auth/register/users`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        if(this.form.value.user_type == 'Student') {
          this.router.navigateByUrl("/student");
        } else {
          this.router.navigateByUrl("/users");
        }
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  update() {
    this.loading = true;
    delete this.form.value.password;
    this.api.put(`crud/users/${this.user.id}`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert('Profile has been updated.');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getUser(user_id: any) {
    this.loading = true;
    this.api.get(`crud/users/${user_id}`)
      .subscribe((response: any) => {
        this.loading = false;
        this.user = response;
        this.form.get('name').setValue(response.name);
        this.form.get('email').setValue(response.email);
        this.form.get('phone').setValue(response.phone);
        // this.form.get('company').setValue(response.company);
        this.form.get('phone').setValue(response.phone);
        this.form.get('user_type').setValue(response.user_type);
        // this.form.get('team_size').setValue(response.team_size);
        this.form.get('address').setValue(response.address);
        this.form.markAsDirty();
      }, error => {
        this.loading = false;
        this.router.navigateByUrl("/dasboard");
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }
}