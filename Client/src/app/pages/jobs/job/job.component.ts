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
  job: any = {
    title : ""
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
      .subscribe((response: any) => {
        this.loading = false;
        this.job = response;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  applyJob() {
    this.loading = true;
    this.api.post(`applications`, {
      job_id : this.job.id
    })
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert("Applied successfully.");
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  backClicked() {
    this._location.back();
  }
}