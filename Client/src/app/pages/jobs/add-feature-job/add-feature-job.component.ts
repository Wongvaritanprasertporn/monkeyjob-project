import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-add-feature-job',
  templateUrl: './add-feature-job.component.html',
  styleUrls: ['./add-feature-job.component.css']
})
export class AddFeatureJobComponent implements OnInit {

  bannerImg: File | any;
  progress = 0;
  message = '';
  form: any;
  loading: boolean | undefined;

  features: any = {
    id: "",
    title: ""
  };

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: FileUploadService
  ) { }

  ngOnInit() {
    if (!this.auth.user.subscription[2]) {
      this.router.navigateByUrl('/subscription')
    }

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      detail: ['', Validators.required],
      image: ['', Validators.required],
      bound: ['', [Validators.required]],

    });

    if (this.activatedRoute.snapshot.paramMap.get('banner_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('banner_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.features.id) {
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
    this.api.get(`crud/feature/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.features = response;

          this.form.get('title').setValue(this.features.title);
          this.form.get('detail').setValue(this.features.detail);
          this.form.get('image').setValue(environment.url + "storage/banner/" + this.features.image);
          this.form.get('bound').setValue(this.features.bound);

          this.form.markAsDirty();

        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  upload(): void {
    this.progress = 0;
    const file: File | null = this.bannerImg;
    if (file) {
      this.bannerImg = file;
      this.uploadService.upload(this.bannerImg).subscribe({
        next:
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              // this.fileInfos = this.uploadService.getFiles();
            }
          },
        error: (error: any) => {
          console.log(error);
          this.progress = 0;
          if (error.error && error.error.message) {
            this.message = error.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
        }
      });
    }
  }

  save() {
    this.loading = true;
    this.api.post(`jobs/`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigateByUrl('banner/list');
          this.fun.presentAlert('Banner has been created.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  update() {
    this.loading = true;
    this.api.put(`crud/jobs/${this.features.id}`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.fun.presentAlert('Banner has been updated.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }
}