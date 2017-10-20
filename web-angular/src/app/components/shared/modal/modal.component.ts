import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  ///当前是否为开启状态
  status = false;
  @Output('onClose') onClose = new EventEmitter<ModalComponent>();
  @Input('showHeader') showHeader = true;
  @Input('showFooter') showFooter = true;
  @Input('showCloseBtn') showCloseBtn = false;
  constructor() { }

  ngOnInit() {
  }
  openModal() {
    this.status = true;
  }
  closeModal() {
    this.status = false;
    setTimeout(() => {
      this.onClose.emit(this);
    }, 500);
  }
}
