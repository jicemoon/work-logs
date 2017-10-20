import { NguiDatetime } from '@ngui/datetime-picker';
NguiDatetime.locale = {
  date: '日',
  time: 'time',

  year: 'year',
  month: 'month',
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  currentTime: '当前时间'
};
NguiDatetime.firstDayOfWeek = 1;
NguiDatetime.daysOfWeek = [
  { fullName: '星期日', shortName: '日' },
  { fullName: '星期一', shortName: '一' },
  { fullName: '星期二', shortName: '二' },
  { fullName: '星期三', shortName: '三' },
  { fullName: '星期四', shortName: '四' },
  { fullName: '星期五', shortName: '五' },
  { fullName: '星期六', shortName: '六' }
];
NguiDatetime.months = [
  { fullName: '一月', shortName: '一月' },
  { fullName: '二月', shortName: '二月' },
  { fullName: '三月', shortName: '三月' },
  { fullName: '四月', shortName: '四月' },
  { fullName: '五月', shortName: '五月' },
  { fullName: '六月', shortName: '六月' },
  { fullName: '七月', shortName: '七月' },
  { fullName: '八月', shortName: '八月' },
  { fullName: '九月', shortName: '九月' },
  { fullName: '十月', shortName: '十月' },
  { fullName: '十一月', shortName: '十一月' },
  { fullName: '十二月', shortName: '十二月' }
];
// NguiDatetime.formatDate = function ( d: Date, format: string = 'YYYY-MM-DD', dateOnly: boolean = true): string {
//     const o = {
//         'Y+': d.getFullYear(),
//         'M+': d.getMonth() + 1,                 //月份
//         'D+': d.getDate(),                    //日
//         'h+': d.getHours(),                   //小时
//         'm+': d.getMinutes(),                 //分
//         's+': d.getSeconds(),                 //秒
//         'q+': Math.floor((d.getMonth() + 3) / 3), //季度
//         'S+': d.getMilliseconds()             //毫秒
//     };
//     for (const k in o) {
//         if (new RegExp('(' + k + ')').test(format)) {
//             if (k === 'y+') {
//                 format = format.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length));
//             }
//             else if (k === 'S+') {
//                 let lens = RegExp.$1.length;
//                 lens = lens === 1 ? 3 : lens;
//                 format = format.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens));
//             }
//             else {
//                 format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
//             }
//         }
//     }
//     return format;
// };
