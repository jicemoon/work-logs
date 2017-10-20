export class ResponseJSONModel<T> {
  /**
   * 登陆状态
   */
  public isLogin: boolean;
  /**
   * 数据是否获取成功
   */
  public status: boolean;
  /**
   * 数据获取失败后返回的消息
   */
  public message: string;
  /**
   * 成功获取到的数据
   */
  public data?: T;
  constructor({ isLogin = true, status = false, message = '', data}: { isLogin?: boolean, status?: boolean, message?: string, data?: T}) {
    this.isLogin = isLogin;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
/**
 * 分页返回数据格式
 */
export class ResponsePagingJSON<T> {
  constructor(public pageData: IPageData = {pageSize: 15, pageIndex: 1, total: 0}, public dataList: T[]) {
    this.pageData.pageSize = pageData.pageSize || 15;
    this.pageData.pageIndex = pageData.pageIndex || 1;
    this.pageData.total = pageData.total || 0;
  }
}
export interface IPageData {
  /**
   * 每页数量
   */
  pageSize: number;
  /**
   * 当前页码
   */
  pageIndex: number;
  /**
   * 总条数
   */
  total: number;
}
