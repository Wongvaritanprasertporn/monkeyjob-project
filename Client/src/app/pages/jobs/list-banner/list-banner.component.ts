import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-banner',
  templateUrl: './list-banner.component.html',
  styleUrls: ['./list-banner.component.css']
})
export class ListBannerComponent implements OnInit {

  loading: boolean | undefined;
  banners: any;
  currency = environment.currency;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getBanner();
  }

  getBanner() {
    this.loading = true;
    this.api.get(`banner`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.banners = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  confirmDelete(banner : any) {
    let el = this;
    el.fun.presentConfirm(function(e) {
      if(e) {
          el.delete(banner._id);
      }
    }, 'Confirm delete');
  }

  delete(banner_id : any) {
    this.loading = true;
    this.api.delete(`crud/banner/${banner_id}`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.getBanner()
        this.fun.presentAlert('Job has been deleted.');
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

}
