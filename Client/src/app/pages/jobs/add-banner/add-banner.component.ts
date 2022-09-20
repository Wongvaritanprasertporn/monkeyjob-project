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
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {

  bannerImg: File | any;
  progress = 0;
  message = '';
  form: any;
  loading: boolean | undefined;
  
  banners: any = {
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
    if (!this.auth.user.subscription[1]) {
      this.router.navigateByUrl('/subscription')
    }

    this.form = this.formBuilder.group({
      image: ['', Validators.required],
      bound: ['', [Validators.required, Validators.min(1)]],

    });

    if (this.activatedRoute.snapshot.paramMap.get('banner_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('banner_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.banners.id) {
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
    this.api.get(`crud/banner/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.banners = response;

          this.form.get('image').setValue(environment.url + "/storage/banner/" + this.banners.image);
          this.form.get('bound').setValue(this.banners.bound);

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
    this.form.value.banner = this.form.value.banner + this.auth + 
    this.api.post(`banner/`, this.form.value)
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
    this.api.put(`crud/banner/${this.banners.id}`, this.form.value)
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