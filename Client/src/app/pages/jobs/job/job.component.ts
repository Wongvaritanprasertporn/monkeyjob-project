import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  loading: boolean | undefined;
  applications: any = [];
  currency = environment.currency;
  user: any = {};
  job: any = {
    title: "",
    _id: ""
  };
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router,
    public api: ApiService,
    private activatedRoute: ActivatedRoute,
    public _location: Location
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }
  }

  getJob(job_id: any) {
    this.loading = true;
    this.api.get(`crud/jobs/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.job = response;
          this.getBusinessData(this.job.user_id)
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  getBusinessData(user_id: any) {
    this.loading = true;
    this.api.get(`crud/get_user/${user_id}/`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.user = response;
          console.log(this.user);
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      })
  }

  applyJob() {
    this.loading = true;
    this.api.post(`applications`, {
      job_id: this.job.id
    })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.fun.presentAlert("Applied successfully.");
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  backClicked() {
    this._location.back();
  }
}