import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-shortlist',
  templateUrl: './list-shortlist.component.html',
  styleUrls: ['./list-shortlist.component.css']
})
export class ListShortlistComponent implements OnInit {
loading: boolean | undefined;
  applications: any = [];
  currency = environment.currency;
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    public api: ApiService
  ) { }


  ngOnInit() {
    this.getApplications();
  }

  getApplications() {
    this.loading = true;
    this.api.get(`applications/2`)
      .subscribe((response: any) => {
        this.loading = false;
        this.applications = response;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  updateApplicationsStatus(application : any, status : any) {
    this.loading = true;
    let body = {
      status : status
    };
    this.api.put(`crud/applications/${application._id}`, body)
      .subscribe((response: any) => {
        this.loading = false;
        this.getApplications();
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

}