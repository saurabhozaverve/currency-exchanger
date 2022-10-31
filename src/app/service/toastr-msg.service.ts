import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrMsgService {
  constructor(private toastr: ToastrService) {}
  showToastr(title: string = '', message: string = '', type: number = 0) {
    if (type == 1) this.toastr.success(title, message, { timeOut: 2000 });
    if (type == 2) this.toastr.warning(title, message, { timeOut: 2000 });
    if (type == 3) this.toastr.error(title, message, { timeOut: 2000 });
  }
}
