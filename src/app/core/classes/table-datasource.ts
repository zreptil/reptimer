import {DataSource} from '@angular/cdk/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {Observable, of as observableOf, merge} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';

/**
 * Generic Datasource class for mat-table
 *
 * This works for VorgangListComponent, others should be tested.
 * MatTableDataSource has everything that is neede for MatTable
 * to work.
 *
 * The advantage of this TableDatsource over MatTableDataSource
 * is that it is not neccessary to fill the internal Array from
 * outside. But this could also be achieved by:
 *
 * new MatTableDataSource<VorgangTableItem>(new Array<VorgangTableItem>());
 *
 * Maybe there are other Methods needed for our framework, so
 * we should stick with this own class for TableDatasource.
 *
 * Andi
 */
export class TableDatasource<T> extends MatTableDataSource<T> {
  constructor() {
    super(new Array<T>());
  }
// }

/**
 * Generic Datasource class for mat-table
 * This class should encapsulate all logic for fetching and manipulating
 * the displayed data
 * (including sorting, pagination, and filtering).
 *
 * TODO: Verwendung der Klasse MatTableDataSource<T> als Basisklasse???
 */
// export class TableDatasource<T> extends DataSource<T> {
//   private owndata: T[] = new Array<T>();
//
//   constructor() {
//     super();
//   }
//
//   get data(): T[] {
//     return this.owndata;
//   }
//
//   set data(value: T[]) {
//     this.owndata = value;
//   }
//
//   paginator: MatPaginator;
//   sort: MatSort;
//
//   /**
//    * Connect this data source to the table. The table will only update when
//    * the returned stream emits new items.
//    * @returns A stream of the items to be rendered.
//    */
//   connect(): Observable<T[]> {
//     // Combine everything that affects the rendered data into one update
//     // stream for the data-table to consume.
//     const dataMutations = [
//       observableOf(this.data),
//       this.paginator?.page,
//       this.sort?.sortChange
//     ];
//
//     return merge(...dataMutations).pipe(map(() => {
//       return this.getPagedData(this.getSortedData([...this.data]));
//     }));
//   }
//
//   /**
//    * Called when the table is being destroyed. Use this function, to clean up
//    * any open connections or free any held resources that were set up during connect.
//    */
//   disconnect(): void {
//   }
//
//   /**
//    * Paginate the data (client-side). If you're using server-side pagination,
//    * this would be replaced by requesting the appropriate data from the server.
//    */
//   private getPagedData(data: T[]): T[] {
//     const startIndex = (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);
//     return data.splice(startIndex, this.paginator?.pageSize ?? 0);
//   }
//
  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: T[]): T[] {
    if (!(this.sort?.active || 0) || (this.sort?.direction || '') === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc'; // boolean
      const sortProperty = this.sort?.active || 0; // string column name. Is already checked as entry condition
      const aP = a[`${sortProperty}`];
      const bP = b[`${sortProperty}`];
      const sortType = typeof aP;

      switch (sortType) {
        case 'string':
          return compare(aP, bP, isAsc);
        case 'number':
          return compare(+aP, +bP, isAsc);
        case 'object':
          if (Object.prototype.toString.call(aP) === '[object Date]') {
            const ad = aP?.getTime() ?? 0;
            const bd = bP?.getTime() ?? 0;
            return compare(ad, bd, isAsc);
          }
          // sorting for other types NYI
          return 0;
        default:
          return 0;
      }
    });
  }
}

/**
 * Simple sort comparator for example ID/Name columns (for client-side sorting).
 */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
