import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-feature-jobs',
  templateUrl: './feature-jobs.component.html',
  styleUrls: ['./feature-jobs.component.css']
})
export class FeatureJobsComponent implements OnInit {

  content: any;
  loading = true;
  features: any;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
  ) { }

    
    ngOnInit(): void {
    
  }

  getFeature() {
    this.loading = true;
    this.api.get(`feature`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.content = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

}
