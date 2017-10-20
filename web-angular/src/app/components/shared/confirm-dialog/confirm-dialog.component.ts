import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

export class ConfirDialogOptions {
  id?: string;
  title? = '操作提示';
  showCloseBtn? = false;
  content = '';
  okText? = '确定';
  cancelText? = '取消';
  okHandle?: (dialog?: ConfirmDialogComponent) => boolean = (): boolean => true;
  cancelHandle?: (dialog?: ConfirmDialogComponent) => boolean = (): boolean => true;
  onClose?: (dialog?: ConfirmDialogComponent) => void = () => {};
}
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild('myModal') myModal: ModalComponent;
  options: ConfirDialogOptions;
  constructor() {
    this.options = new ConfirDialogOptions();
  }
  showDialog(options: ConfirDialogOptions | string) {
    let params: ConfirDialogOptions;
    if (typeof options === 'string') {
      params = { content: options};
    } else {
      params = options;
    }
    Object.assign(this.options, params);
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
  ngOnInit() {
  }
}
