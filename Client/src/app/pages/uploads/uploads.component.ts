import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { FileUploadService } from '../../services/file-upload.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
form: any;
  loading: boolean | undefined;
  user_type = 1;
   selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private uploadService: FileUploadService
) {}

ngOnInit() {
}

getUserType(e: any) {
    this.user_type = e;
}

selectFile(event: any): void {
    this.selectedFiles = event.target.files;
}

upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
            this.currentFile = file;
            this.uploadService.upload(this.currentFile).subscribe(
                (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.message = event.body.message;
                        // this.fileInfos = this.uploadService.getFiles();
                        this.update(event.body.file);
                    }
                },
                (error: any) => {
                    console.log(error);
                    this.progress = 0;
                    if (error.error && error.error.message) {
                        this.message = error.error.message;
                    } else {
                        this.message = 'Could not upload the file!';
                    }
                    this.currentFile = undefined;
                });
        }
        this.selectedFiles = undefined;
    }
}

update(file : any) {
    this.loading = true;
    this.api.put(`authenticated/users`, {
        resume : file
    })
      .subscribe((response: any) => {
        this.loading = false;
        this.auth.setUser(response.user);
        this.fun.presentAlert("Resume Updated.");
        this.router.navigateByUrl('/dashboard');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  downloadResume() {
    window.open(`${environment.url}auth/user/download/${this.auth.user.resume}`);
  }


}