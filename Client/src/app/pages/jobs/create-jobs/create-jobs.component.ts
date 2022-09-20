import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-jobs',
  templateUrl: './create-jobs.component.html',
  styleUrls: ['./create-jobs.component.css']
})
export class CreateJobsComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  job: any = {
    id: "",
    title: ""
  };
  checkJobs: any;
  jobsCount: number = 0;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      email: [''],
      minimum_age: ['', [Validators.required, Validators.min(1)]],
      maximum_age: ['', [Validators.required, Validators.min(1)]],
      city: [''],
      salary: ['', [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.api.get(`jobs`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.checkJobs = response;
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });

      for (let i of this.checkJobs) {
        this.jobsCount++
      }

      if (this.jobsCount > 1 && this.auth.user.subscription[0] == false) {
        this.router.navigateByUrl('/subscription')
      }

    this.form.value.email = this.auth.user.email;
    this.form.value.city = this.auth.user.city;

    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.job.id) {
        this.save();
      } else {
        this.update();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }


  getJob(job_id: any) {
    this.loading = true;
    this.api.get(`crud/jobs/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.job = response;

          this.form.get('title').setValue(this.job.title);
          this.form.get('email').setValue(this.job.email)
          this.form.get('minimum_age').setValue(this.job.minimum_age);
          this.form.get('salary').setValue(this.job.salary);
          this.form.get('description').setValue(this.job.description);
          this.form.get('type').setValue(this.job.type);
          this.form.get('maximum_age').setValue(this.job.maximum_age);
          this.form.markAsDirty();

        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  save() {
    this.loading = true;
    this.api.post(`jobs/`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigateByUrl('jobs/list');
          this.fun.presentAlert('Job has been created.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  update() {
    this.loading = true;
    this.api.put(`crud/jobs/${this.job.id}`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.fun.presentAlert('Job has been updated.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

}