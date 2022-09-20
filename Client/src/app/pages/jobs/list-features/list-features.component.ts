import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-features',
  templateUrl: './list-features.component.html',
  styleUrls: ['./list-features.component.css']
})
export class ListFeaturesComponent implements OnInit {

  loading: boolean | undefined;
  features: any;
  currency = environment.currency;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFeature();
  }

  getFeature() {
    this.loading = true;
    this.api.get(`feature`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.features = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  confirmDelete(feature : any) {
    let el = this;
    el.fun.presentConfirm(function(e) {
      if(e) {
          el.delete(feature._id);
      }
    }, 'Confirm delete');
  }

  delete(feature_id : any) {
    this.loading = true;
    this.api.delete(`crud/feature/${feature_id}`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.getFeature()
        this.fun.presentAlert('Feature Jobs has been deleted.');
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

}