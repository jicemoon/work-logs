import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ConfirDialogOptions } from '../confirm-dialog/confirm-dialog.component';
import { WorkDayLog } from '../../../models/responseJson.model';

export class WorkDayLogDetailsDialogOptions {
  showHeader? = true;
  okText?= '';
  cancelText?= '';
  okHandle?: (dialog?: WorkDayLogDetailsDialogComponent) => boolean = (): boolean => true;
  cancelHandle?: (dialog?: WorkDayLogDetailsDialogComponent) => boolean = (): boolean => true;
  onClose?: (dialog?: WorkDayLogDetailsDialogComponent) => void = () => { };
}

@Component({
  selector: 'app-work-day-log-details-dialog',
  templateUrl: './work-day-log-details-dialog.component.html',
  styleUrls: ['./work-day-log-details-dialog.component.scss']
})
export class WorkDayLogDetailsDialogComponent implements OnInit {
  @ViewChild('myModal') myModal: ModalComponent;
  options: WorkDayLogDetailsDialogOptions = new WorkDayLogDetailsDialogOptions();
  showFooter = false;
  currentDetailLog: WorkDayLog;
  constructor() {
    this.currentDetailLog = {
      date: '',
      completed: '',
      plan: '',
      progress: '',
      user: {
        id: ''
      }
    };
    this.options = new WorkDayLogDetailsDialogOptions();
  }

  ngOnInit() {
  }
  showDialog(currentDetailLog: WorkDayLog, options?: WorkDayLogDetailsDialogOptions) {
    this.currentDetailLog = currentDetailLog;
    Object.assign(this.options, options || {});
    this.showFooter = !!(this.options.okText || this.options.cancelText);
    this.myModal.openModal();
  }
  confirmHandle() {
    let isClosed = true;
    if (this.options.okHandle) {
      isClosed = this.options.okHandle(this);
    }
    if (isClosed) {
      this.myModal.closeModal();
    }
  }
  cancelHandle() {
    let isClosed = true;
    if (this.options.cancelHandle) {
      isClosed = this.options.cancelHandle(this);
    }
    if (isClosed) {
      this.myModal.closeModal();
    }
  }
  closeHandle(modal: ModalComponent) {
    if (this.options.onClose) {
      this.options.onClose(this);
    }
  }
}
