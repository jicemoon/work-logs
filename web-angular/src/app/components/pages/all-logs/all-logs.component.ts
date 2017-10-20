import { Component, OnInit } from '@angular/core';

import { ResponsePagingJSON, WorkDayLog } from './../../../models/responseJson.model';

@Component({
  selector: 'app-all-logs',
  templateUrl: './all-logs.component.html',
  styleUrls: ['./all-logs.component.scss']
})
export class AllLogsComponent implements OnInit {
  logList: WorkDayLog[];
  constructor() { }
  ngOnInit() {
  }
  getWorkDayLogs(json: ResponsePagingJSON<WorkDayLog>) {
      this.logList = json.dataList;
  }
}
