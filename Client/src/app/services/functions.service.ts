import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

// import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  currentDate() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss');
  }

  transformDate(date: string | number | Date, sequence = 'MMM dd, yyyy') {
    // MySql format - 'y-MM-dd'
    return this.datePipe.transform(date, sequence);
  }

  presentAlert(title: string | undefined, message = '') {
    // Swal.fire(title, message, 'success')
    this.toastr.show(title, message);
  }

  presentAlertError(title: string | undefined, message = '') {
    // Swal.fire(title, message, 'error')
    this.toastr.show(title, message);
  }

  presentInfo(title: string | undefined, message = '') {
    // Swal.fire(title, message, 'error')
    this.toastr.info(title, message);
  }

  presentConfirm(fn: (arg0: boolean) => void, title: any, message = '') {
    // Swal.fire({
    //   title: title,
    //   text: message,
    //   icon: 'warning',
    //   showCancelButton: true
    // }).then((result) => {
    //   if (result.value) {
    //     fn(true)
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     fn(false)
    //   }
    // })
  }

  remove_object_from_array(array: any[], object: any) {
    return array.splice(array.indexOf(object), 1);
  }

  getUserTypeTitle(array: any, id: any) {
    return array.filter((x: { id: any; }) => x.id == id).map((x: { title: any; }) => x.title);
  }
}