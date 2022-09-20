import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-jobs',
  templateUrl: './feature-jobs.component.html',
  styleUrls: ['./feature-jobs.component.css']
})
export class FeatureJobsComponent implements OnInit {
  loading: boolean | undefined;
  features: any;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs() {
    this.loading = true;
    this.api.get(`crud/urgent/`)
      .subscribe({next:(response: any) => {
        this.loading = false;
        this.features = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}