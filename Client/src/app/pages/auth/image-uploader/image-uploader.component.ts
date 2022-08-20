import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  background: string = '';
  form: any;

  @Output() imageFile = new EventEmitter<string>();
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef | undefined
  @ViewChild("imageShow", {static: false}) imageShow: ElementRef | undefined

  constructor(
  ) {}

  ngOnInit(): void {

  }

  uploadFile() {
    const fileInput = this.fileUpload?.nativeElement
    if (fileInput) {
      this.background = URL.createObjectURL(fileInput.files[0])
      this.imageFile.emit(fileInput.files[0])
    }
  }

  getResponsiveStyle(): Object {
    return {backgroundImage: 'url(' + this.background + ')'}
  }
}
