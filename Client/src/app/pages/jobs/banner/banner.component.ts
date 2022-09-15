import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  form: any;
  loading: boolean | undefined;
  banner: any = {
    id: "",
    banner: ""
  };

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
      banner: ['', [Validators.required]]
    })

    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.banner.id) {
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
          this.banner = response;

          this.form.get('banner').setValue(this.banner.banner);

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
    this.api.put(`crud/jobs/${this.banner.id}`, this.form.value)
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
