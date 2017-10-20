if (!Date.prototype.format) {
  //格式化日期
  ///y+[年], M+[月], d+[日], h+[时], m+[分], s+[秒], S+[毫秒], q+[季度]
  Date.prototype.format = function (fmt) {
    const o: any = {
      'y+': this.getFullYear(),
      'M+': this.getMonth() + 1,                 //月份
      'd+': this.getDate(),                    //日
      'h+': this.getHours(),                   //小时
      'm+': this.getMinutes(),                 //分
      's+': this.getSeconds(),                 //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S+': this.getMilliseconds()             //毫秒
    };
    for (const k of Object.keys(o)) {
      const value = o[k];
      if (new RegExp('(' + k + ')').test(fmt)) {
        if (k === 'y+') {
          fmt = fmt.replace(RegExp.$1, ('' + value).substr(4 - RegExp.$1.length));
        }
        else if (k === 'S+') {
          let lens = RegExp.$1.length;
          lens = lens === 1 ? 3 : lens;
          fmt = fmt.replace(RegExp.$1, ('00' + value).substr(('' + value).length - 1, lens));
        }
        else {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (value) : (('00' + value).substr(('' + value).length)));
        }
      }
    }
    return fmt;
  };
}
interface Date {
  /**
   * 日期格式化
   * y+[年], M+[月], d+[日], h+[时], m+[分], s+[秒], S+[毫秒], q+[季度]
   */
  format(fmt: string): string;
}
