if (!Date.prototype.format) {
    //格式化日期
    ///y+[年], M+[月], d+[日], h+[时], m+[分], s+[秒], S+[毫秒], q+[季度]
    Date.prototype.format = function (fmt) {
        const o = {
            'y+': this.getFullYear(),
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds() //毫秒
        };
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                if (k === 'y+') {
                    fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length));
                }
                else if (k === 'S+') {
                    let lens = RegExp.$1.length;
                    lens = lens === 1 ? 3 : lens;
                    fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens));
                }
                else {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
        }
        return fmt;
    };
}
//# sourceMappingURL=prototype.extends.js.map