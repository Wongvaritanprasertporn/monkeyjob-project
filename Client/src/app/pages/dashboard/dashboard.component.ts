import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FunctionsService } from '../../services/functions.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean | undefined;
  applications: any = [];
  currency = environment.currency;

  counts = {
    jobs : 0,
    applications : 0,
    shortlisted_applications : 0,
    messages : 0
  };
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router,
    public api: ApiService
  ) { }


  ngOnInit() {
    this.getApplications();
    this.getJobCount();
    this.getApplicationCount();
    this.getShortlistApplicationCount();
    this.getMessagesCount();
  }

  getApplications() {
    this.loading = true;
    this.api.get(`applications/1`)
      .subscribe((response: any) => {
        this.loading = false;
        this.applications = response;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  updateApplicationsStatus(application: any, status: any) {
    this.loading = true;
    let body = {
      status: status
    };
    this.api.put(`crud/applications/${application._id}`, body)
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert("Application status has been updated.");
        this.getApplications();
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getJobCount() {
    this.api.get(`jobs/count`)
      .subscribe((response: any) => {
        this.counts.jobs = response.count;
      }, error => {
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getApplicationCount() {
    this.api.get(`applications/count/0`)
      .subscribe((response: any) => {
        this.counts.applications = response.count;
      }, error => {
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getShortlistApplicationCount() {
    this.api.get(`applications/count/2`)
      .subscribe((response: any) => {
        this.counts.shortlisted_applications = response.count;
      }, error => {
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getMessagesCount() {
    this.api.get(`messages/count/`)
      .subscribe((response: any) => {
        this.counts.messages = response.count;
      }, error => {
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }
}