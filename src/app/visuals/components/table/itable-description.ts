/**
 * Contains description for visuals/table
 */
export interface ITableDescription {
  /**
   * Description for table paginator
   */
  paginator?: {
    /** Which table page to show */
    pageIndex?: number;
    /** How much items to show per page */
    pageSize?: number;
    /** Selection of items to show per page */
    pageSizeOptions?: number[]
  };
}
