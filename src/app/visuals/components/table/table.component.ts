import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {InitElementService} from '@/visuals/services/init-element.service';
import {IComponentData} from '@/visuals/model/icomponent-data';
import {CPUFormGroup, CPUFormControl, ITableRowData} from '@/core/classes/ibase-component';
import {ITableColumnDescription} from '@/visuals/components/table/itable-column-description';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {TableDatasource} from '@/core/classes/table-datasource';
import {ITableDescription} from '@/visuals/components/table/itable-description';

/*
 * @class TableComponent
 *
 * @example
 * <!-- my.component.html -->
 *   <app-table outerWidth="4" innerWidth="4" [columnDescriptions]="columnDescriptions" formName="testTable"
 *  [formGroup]="form" [tableDescription]="tableDescription"></app-table>
 *   <!-- or -->
 *   <app-table outerWidth="4" innerWidth="4" [columnDescriptions]="columnDescriptions" [noPaginator]="true"
 * [data]="testTable"</app-table>
 *
 * // my.component.ts
 * // Table description; optional
 * tableDescription: ITableDescription = {
 *   paginator: {
 *      pageIndex: 0,
 *      pageSize: 10,
 *      pageSizeOptions: [10, 20, 30]
 *   }
 * }
 *
 * // Column description
 *   public columnDescriptions: ITableColumnDescription[] = [
 {
      id: 'id',
      label: 'Id',
      type: 'string',
      getDataFn: (item: any) => item.id,
      cssClass: ['table-col-id', 'table-first-col']
    },
 {
      id: 'vorname',
      label: 'Vor&shy;na&shy;me',
      type: 'string',
      getDataFn: (item: any) => `${item.vorname} ${item.nachname}`,
      mapValueFn: (item: string) => (item || '').toUpperCase(),
      cssClass: 'table-second-col'
    },
 {
      id: 'nachname',
      label: 'Nach&shy;na&shy;me',
      type: 'string',
      sortable: true
    },
 {
      id: 'eintrittsdatum',
      label: 'Ein&shy;tritts&shy;da&shy;tum',
      type: 'date',
      // mapValueFn: (item: Date) => formatDate(item, 'dd.MM.yyyy', localStorage.getItem('language') || 'de-DE'),
      // tslint:disable-next-line:only-arrow-functions
      mapValueFn: (function() {
        // damit die DatePipe nicht bei jedem Aufruf von mapValueFn (also für jede Tabellen-Zeile) angelegt wird,
        // gibt die Funktion die eigentliche Formatierungs-Funktion zurück.
        const dp: DatePipe = new DatePipe(localStorage.getItem('language') || 'de-DE');

        return (item: Date) => dp.transform(item, 'shortDate');
      })(),
      sortable: true
    },
 {
      id: 'status',
      label: 'Sta&shy;tus',
      type: 'icon',
      mapValueFn: (item: string): string => {
        let ret = '';
        switch (item) {
          case 'Offen':
            ret = 'report_problem';
            break;
          case 'In Bearbeitung':
            ret = 'https';
            break;
          case 'Abgeschlossen':
            ret = 'check_circle_outline';
            break;
        }
        return ret;
      },
      cssClass: (item: string): Iterable<string> => {
        const ret = ['mat-18'];
        switch (item) {
          case 'Offen':
            ret.push('yellow-icon');
            break;
          case 'In Bearbeitung':
            ret.push('red-icon');
            break;
          case 'Abgeschlossen':
            ret.push('green-icon');
            break;
        }
        return ret;
      }
    }
 ];
 *
 * // Table data
 *   public testTable: Iterable<ITableRowData> = [
 {
      value: '', label: '',
      id: '001',
      vorname: 'Max 1',
      nachname: 'Mustermann 1',
      eintrittsdatum: new Date(2020, 2, 25),
      status: 'Offen'
    },
 {
      value: '', label: '',
      id: '002',
      vorname: 'Lieschen',
      nachname: 'Müller',
      eintrittsdatum: new Date(1999, 5, 3),
      status: 'In Bearbeitung'
    }];
 *
 * // FormData
 *   public controls: ControlObject = {
    testTable:  {
      label: $localize`My Table`,
      tableRowData : ( (): Iterable<ITableRowData> => this.testTable )
    },
  };

 */
@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    standalone: false
})
export class TableComponent implements OnInit, IComponentData, AfterViewInit {

  @Input() outerWidth: number;
  @Input() innerWidth: number;
  @Input() innerClass: string;
  @Input() outerClass: string;
  @Input() label: string;
  @Input() formName: string;
  @Input() formGroup: CPUFormGroup;
  // Will show debug info even if in ProdMode or otherwise disabled (by ShowDebugInfoService)
  @Input() alwaysShowDebugInfo: boolean;

  @Input() columnDescriptions: ITableColumnDescription[];
  @Input() tableDescription: ITableDescription;
  @Input() noPaginator: boolean;

  displayedColumns: string[];

  @Input() data: Iterable<ITableRowData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ITableRowData>;
  dataSource = new TableDatasource<ITableRowData>();

  private getDataFnMap: object;
  private mapValueFnMap: object;
  private cssClassFnMap: object;

  constructor(private initElementService: InitElementService) {
    this.initElementService.setDefaultContext(this);
    this.columnDescriptions = null;
    this.displayedColumns = [];
    this.data = [];
    this.tableDescription = null;
    this.noPaginator = false;
  }

  get ctx(): any {
    return {
      ...this.initElementService.initContext(this),
      columnDescriptions: this.columnDescriptions,
      displayedColumns: this.displayedColumns,
      data: this.data,
      tableDescription: this.tableDescription,
      noPaginator: this.noPaginator,
    };
  }

  set ctx(value: any) {
    this.initElementService.mergeContext(value, this);

    this.initGetDataFnMap();
    this.initMapValueFnMap();
    this.initCssClassFnMap();
  }

  ngOnInit(): void {
    if (this.formGroup.data &&
      this.formGroup.data[this.formName] &&
      this.formGroup.data[this.formName].hasOwnProperty('tableRowData')) {
      this.data = (this.formGroup.data[this.formName] as CPUFormControl).tableRowData() as Iterable<ITableRowData>;
    }

    this.displayedColumns = this.columnDescriptions.map(value => value.id);

    this.tableDescription = {
      paginator: {
        pageIndex: 0,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30]
      },
      ...(this.tableDescription || {})
    };

    this.initGetDataFnMap();
    this.initMapValueFnMap();
    this.initCssClassFnMap();
  }

  ngAfterViewInit(): void {
    this.dataSource.data = Array.from(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public pageIndex(): number {
    return this.tableDescription.paginator.pageIndex;
  }

  public pageSize(): number {
    return this.tableDescription.paginator.pageSize;
  }

  public pageSizeOptions(): number[] {
    return this.tableDescription.paginator.pageSizeOptions;
  }

  /**
   *
   * @param id  Id der Tabellenspalte, für die die Daten geholt werden sollen
   * @param data  Datenobjekt, aus dem der Spaltenwert extrahiert werden soll
   * @returns Der Return-Wert der Funktion getDataFn() aus dem ITableColumnDescription-Objekt
   * (falls vorhanden) oder den Wert des Attributs des Datenobjekts mit dem Namen id (falls vorhanden)
   * oder null..
   */
  getCellData(id: string, data: any): any {
    let ret: any = null;
    ret = this.mapValueFnMap[id](this.getDataFnMap[id](data));

    return ret;
  }

  getCellCss(id: string, data: any): string[] {
    let ret: string[] = [];
    if (this.cssClassFnMap.hasOwnProperty(id)) {
      ret = this.cssClassFnMap[id](this.getDataFnMap[id](data));
    }
    return ret;
  }

  getCellLabel(id: string): string {
    let ret = '';
    const col = this.getColumnDescription(id);
    if (!!col) {
      ret = col.label.replace(/&shy;/g, '');
    }
    return ret;
  }


  /* ************ Helpers *************** */

  getColumnDescription(id: string): ITableColumnDescription {
    const ret: ITableColumnDescription = this.columnDescriptions.find((item: ITableColumnDescription) => item.id === id);
    if (ret === null || ret === undefined) {
      throw new Error(($localize`Keine Spaltenbeschreibung für die Tabelle gefunden. Fehlende Spalten-Id: `) + id);
    }
    return ret;

  }

  initGetDataFnMap(): void {
    this.getDataFnMap = {};
    this.columnDescriptions.forEach((item: ITableColumnDescription): any => {
      const id = item.id;
      const col: ITableColumnDescription = this.getColumnDescription(id);
      const getDataFn = col.getDataFn ? col.getDataFn : (data: any): any => {
        if (data && data.hasOwnProperty(id)) {
          return data[id];
        } else {
          throw new Error(($localize`Datenobjekt ist entweder ungültig oder hat keine Eigenschaft `) + id);
        }
      };
      this.getDataFnMap[id] = getDataFn;
    });
  }

  initMapValueFnMap(): void {
    this.mapValueFnMap = {};
    this.columnDescriptions.forEach((item: ITableColumnDescription): any => {
      const id = item.id;
      const col: ITableColumnDescription = this.getColumnDescription(id);
      const mapValueFn = col.mapValueFn ? col.mapValueFn : (data: any): any => data;
      this.mapValueFnMap[id] = mapValueFn;
    });
  }

  initCssClassFnMap(): void {
    this.cssClassFnMap = {};
    this.columnDescriptions.forEach((item: ITableColumnDescription): any => {
      const id = item.id;
      const col: ITableColumnDescription = this.getColumnDescription(id);
      let cssClassFn: (item: any) => Iterable<string>;
      if (col.cssClass) {
        if ('function' === typeof col.cssClass) {
          cssClassFn = col.cssClass;
        } else if (col.cssClass instanceof Array) {
          cssClassFn = (item1: any): Iterable<string> => col.cssClass as string[];
        } else {
          cssClassFn = (item1: any): Iterable<string> => [col.cssClass as string];
        }
      } else {
        cssClassFn = (item1: any) => [];
      }
      this.cssClassFnMap[id] = cssClassFn;
    });
  }

}

