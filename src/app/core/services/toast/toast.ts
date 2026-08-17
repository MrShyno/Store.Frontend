import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string): void {
    this.toastr.success(message, title || 'موفقیت', {
      timeOut: 3000,
      progressBar: true
    });
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title || 'خطا', {
      timeOut: 5000,
      progressBar: true,
      extendedTimeOut: 2000
    });
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title || 'هشدار', {
      timeOut: 4000,
      progressBar: true
    });
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title || 'توجه', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showApiResponse(response: any): void {
    if (response.success) {
      this.success(response.message || 'Operation completed successfully');
    } else {
      this.error(response.message || 'Operation failed');
    }
  }

  showHttpError(error: any): void {
    let message = 'An unexpected error occurred';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    this.error(message);
  }
}
