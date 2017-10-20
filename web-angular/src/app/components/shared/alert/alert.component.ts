import { Component, Output, EventEmitter} from '@angular/core';

export class AlertTypes {
  static success = 'success';
  static info = 'info';
  static warning = 'warning';
  static danger = 'danger';
}
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  alert = {
    type: '',
    message: '',
    title: '',
    status: false
  };
  timeout: any;
  @Output() onClose = new EventEmitter();
  constructor() { }
  showAlert(title = '', msg = '', type = AlertTypes.info, autoHidden = 3000) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.alert.title = title;
    this.alert.message = msg;
    this.alert.type = 'alert-' + type;
    this.alert.status = true;
    this.timeout = setTimeout(() => {
      this.alert.status = false;
      this.onClose.emit();
    }, autoHidden);
  }
}
