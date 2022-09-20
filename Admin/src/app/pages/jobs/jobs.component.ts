import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  loading: boolean | undefined;
  jobs: any;
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
    this.api.get(`crud/jobs/`)
      .subscribe({next:(response: any) => {
        this.loading = false;
        this.jobs = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

}
