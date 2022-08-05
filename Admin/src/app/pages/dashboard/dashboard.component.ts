import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean | undefined;
  users_count = 0;
  users : any;
  jobs_count = 0;
  jobs : any;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }


  ngOnInit() {
    this.getUsersCount();
    this.getJobsCount();
  }

  getUsersCount() {
    this.loading = true;
    this.api.get('admin/count/users/')
      .subscribe((response: any) => {
        this.loading = false;
        this.users_count = response.count;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getJobsCount() {
    this.loading = true;
    this.api.get('admin/count/jobs')
      .subscribe((response: any) => {
        this.loading = false;
        this.jobs_count = response.count;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

}