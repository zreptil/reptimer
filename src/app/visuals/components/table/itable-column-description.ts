/**
 * Description for columns for visuals/table
 */
export interface ITableColumnDescription {
  /** Column id */
  id: string;
   /** Column label to show in table header */
  label: string;
  /** Data type to show in this column; at the moment only 'icon' is treated differently */
  type?: string;
  /** Function to extract cell data from model data object.
   * If not provided, a pseudo-identity will be used as in (dataSource) => dataSource[id].
   * Can be used to map one attribute to another as in (dataSource) => dataSource[anotherId] given the id is 'id'.
   *
   * @param dataSource data for table row
   * @returns cell value extracted from data row
   */
  getDataFn?: (dataSource: any) => any;
  /** Function to map exact cell value to another.
   * Can be used as a decorator (transform lower / upper case, localize date or money values).
   * If omitted an identity will be used as in (value) => value
   *
   * @param value actual cell value
   * @returns processed cell value
   */
  mapValueFn?: (value: any) => any;
  /** CSS Classes to mark this table column. */
  cssClass?: string | Iterable<string> | ( (value: any) => Iterable<string> );
  /** Should this column be sortable or not */
  sortable?: boolean;
}
