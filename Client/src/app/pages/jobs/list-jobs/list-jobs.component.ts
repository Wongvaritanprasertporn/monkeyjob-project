import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css']
})
export class ListJobsComponent implements OnInit {
  loading: boolean | undefined;
  jobs: any;
  currency = environment.currency;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.loading = true;
    this.api.get(`jobs`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.jobs = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  confirmDelete(job : any) {
    let el = this;
    el.fun.presentConfirm(function(e) {
      if(e) {
          el.delete(job._id);
      }
    }, 'Confirm delete');
  }

  delete(job_id : any) {
    this.loading = true;
    this.api.delete(`crud/jobs/${job_id}`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.getJobs();
        this.fun.presentAlert('Job has been deleted.');
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}