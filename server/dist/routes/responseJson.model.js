"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseJSONModel {
    constructor({ isLogin = true, status = false, message = '', data }) {
        this.isLogin = isLogin;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
exports.ResponseJSONModel = ResponseJSONModel;
/**
 * 分页返回数据格式
 */
class ResponsePagingJSON {
    constructor(pageData = { pageSize: 15, pageIndex: 1, total: 0 }, dataList) {
        this.pageData = pageData;
        this.dataList = dataList;
        this.pageData.pageSize = pageData.pageSize || 15;
        this.pageData.pageIndex = pageData.pageIndex || 1;
        this.pageData.total = pageData.total || 0;
    }
}
exports.ResponsePagingJSON = ResponsePagingJSON;
//# sourceMappingURL=responseJson.model.js.map