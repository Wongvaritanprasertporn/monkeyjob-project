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

  }

  submit() {
    if (this.user_type == 1) {
      this.router.navigateByUrl('/register/business');
    }
    else {
      this.router.navigateByUrl('/register/employee');
    }
  }

  update() {
    /*
    if(this.user_type == 2 && !this.form.value.company) {
      this.fun.presentAlertError("Company name is required.");
      return;
    }

    this.loading = true;
    this.form.value.user_type = this.user_type;
    this.api.put(`authenticated/users/`, this.form.value)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.auth.setLogin(response);
        if(this.user_type == 1) {
          this.router.navigateByUrl('/uploads');
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }, complete: () => {}});
    */
    
  }

  getUserType(e: any) {
    this.user_type = e;
  }

}