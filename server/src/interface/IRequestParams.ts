/**
 * 分页要传的参数
 */
export interface IPageParams {
  /**
   * 每页显示条数
   */
  pageSize?: number;
  /**
   * 当前页数, 默认为1
   */
  pageIndex?: number;
}
/**
 * 搜索日志要用到的参数
 */
export interface IWorkDayLogSearchParams extends IPageParams {
  /**
   * 按日期查找, 如果存在endDate参数, 查找date-endDate之间的日志, 否则查找当天的
   */
  date?: string;
  /**
   * 按日期查找, 结束日期
   */
  endDate?: string;
  /**
   * 按部门查找
   */
  departmentId?: string;
  /**
   * 查找此用户的日志
   */
  userId?: string;
}

/**
 * 新增日报参数
 */
export interface IAddDayLogParams {
  /**
   * 日报日期, required
   */
  date: string;
  /**
   * 今日完成, required
   */
  completed: string;
  /**
   * 明日计划, required
   */
  plan: string;
  /**
   * 工作进展, required
   */
  progress: string;
}

