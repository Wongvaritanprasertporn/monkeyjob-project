import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-applications',
  templateUrl: './list-applications.component.html',
  styleUrls: ['./list-applications.component.css']
})
export class ListApplicationsComponent implements OnInit {
  loading: boolean | undefined;
  applications: any = [];
  currency = environment.currency;
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router,
    public api: ApiService
  ) { }


  ngOnInit() {
    this.getApplications();
  }

  getApplications() {
    this.loading = true;
    this.api.get(`applications`)
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

}