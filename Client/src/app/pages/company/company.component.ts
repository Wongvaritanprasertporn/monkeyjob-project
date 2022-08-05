import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  loading: boolean | undefined;
  applications: any = [];
  currency = environment.currency;
  user: any;
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router,
    public api: ApiService,
    private activatedRoute: ActivatedRoute,
    public _location: Location
  ) { }


  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('user_id')) {
      this.getApplicant(this.activatedRoute.snapshot.paramMap.get('user_id'));
    }
  }

  getApplicant(user_id: any) {
    this.loading = true;
    this.api.get(`crud/users/${user_id}`)
      .subscribe((response: any) => {
        this.loading = false;
        this.user = response;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  backClicked() {
    this._location.back();
  }
}