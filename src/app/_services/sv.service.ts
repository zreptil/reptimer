import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {SVItem} from '@/_models/sv-item';
import {SVMap} from '@/core/classes/svmap.enum';
import {EnvironmentService} from '@/_services/environment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

// export const API_ENDPOINT = new InjectionToken<string>('API_ENDPOINT');

/**
 * Service class for all SV (SchlüsselVerzeichnis) data access to backend
 *
 * Implements the CRUD Methods create(), read(), update(), delete() and getList()
 */
@Injectable({
  providedIn: 'root',
})
export class SVService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  // URL to web api
  private readonly endPoint = 'AdminSchluesselverzeichnis';
  private readonly apiUrl = this.env.apiUrl + this.endPoint;
  private cache: Map<number, SVItem[]> = new Map();

  /**
   * Constructor for generic data service
   * @param http the HttpClient used for REST API calls
   * @param env Service with access to the environment
   */
  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {
    console.log(`SV-Service apiUrl: ${this.apiUrl}`);
    // this.buildCache();
  }

  /**
   * GET a list of SV data from the server for the given group.
   * Returns either a list of generic data entries or in case of an error
   * an empty list and lets the app keep running.
   */
  getList(group: number): Observable<SVItem[]> {
    // console.log(`SVService: getList: ${this.apiUrl}/${group}`);
    const ret: SVItem[] | SVItem = this.cacheLookup(group);
    if (ret) {
      return of(ret as SVItem[]);
    }

    const url = `${this.apiUrl}/group/${group}`;
    return this.http.get<SVItem[]>(url)
      .pipe(
        tap(item => {
          // console.log(`fetched ${this.endPoint}/group/${group}`);
          // console.log(`fetched[] ${item} - ${item[0]?.text}`);
          this.cache.set(group, item);
        }),
        // catchError(this.handleError<T>('getList'))
      );
  }

  /**
   * GET generic data by svId and svGroup.
   * Will return 404 if no entry for svId and svGroup is found.
   * @param svId the svId field in DB table AdminSchluesselverzeichnis
   * @param svGroup the fkAdminSchluesselgruppe field in DB table AdminSchluesselverzeichnis
   */
  getBySvIdAndSvGroup(svId: number, svGroup: SVMap): Observable<SVItem> {
    console.log(`SVService: get(svId:${svId}, svGroup:${svGroup}): ${this.apiUrl}`);

    const ret: SVItem[] | SVItem = this.cacheLookup(svGroup, svId);
    if (ret) {
      return of(ret as SVItem);
    }

    const url = `${this.apiUrl}/svGroup/${svGroup}/svId/${svId}`;
    return this.http.get<SVItem>(url)
      .pipe(
        tap(_ => console.log(`get data for id=${svId} from ${url}`)),
        catchError(this.handleError<SVItem>(`get(id=${svId}) from ${url}`))
      );
  }

  public getFromCache(svGroup: SVMap, svId?: number): SVItem[] | SVItem | null {
    return this.cacheLookup(svGroup);
  }

  /**
   * In-memory cache implementation for sv groups
   *
   * @param group
   * @param svId
   * @private TODO: wird noch extern verwendet
   */
  public cacheLookup(group: number, svId?: number): SVItem[] | SVItem | undefined {
    // console.log(`SVService: cacheLookup: group:${group}:${svId}`);
    // console.log(`SVService: cacheLookup: cacheSize:${this.cache.size}`);
    let ret: SVItem[] | SVItem = this.cache.get(group);
    if (ret) {
      // console.log(`SVService: cacheLookup: cache hit:${group}`);
      if (svId) {
        // console.log(`SVService: cacheLookup: group:${group}:${svId}`);
        ret = ret.find(item => item.svid === svId);
      }
    } else {
      // console.log(`SVService: cacheLookup: cache FAIL:${group}`);
    }
    // console.log(`SVService: cacheLookup: group:${group}:${ret}`);
    return ret;
  }

  /**
   * POST: add a new generic data entry to the server
   * @param data the new generic data to be added.
   */
  create(data: SVItem): Observable<SVItem> {
    console.log(`DataService: create(data.id=${(data as any).id}): ${this.apiUrl}`);

    const url = `${this.apiUrl}`;
    return this.http.post<SVItem>(url, data, this.httpOptions)
      .pipe(
        tap((newData: SVItem) => console.log(`created data w/ id=${(newData as any).id}`)),
        catchError(this.handleError<SVItem>('create'))
      );
  }

  // **************************************************************************
  // CRUD Operations
  // **************************************************************************

  /**
   * GET generic data by id.
   * Will return 404 if no entry for id is found.
   * @param id - database ID for the requested generic data element
   */
  read(id: number): Observable<SVItem> {
    console.log(`DataService: get(id=${id}): ${this.apiUrl}`);

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SVItem>(url)
      .pipe(
        tap(_ => console.log(`get data for id=${id} from ${this.apiUrl}`)),
        catchError(this.handleError<SVItem>(`get(id=${id}) from ${this.apiUrl}`))
      );
  }

  /**
   * PUT: update an existing generic data entry on the server.
   * @param data the generic data to be updated.
   */
  update(data: SVItem): Observable<SVItem> {
    console.log(`DataService: update(id=${(data as any)?.id}) from ${this.apiUrl}`);

    const url = `${this.apiUrl}`;
    return this.http.put<SVItem>(url, data, this.httpOptions)
      .pipe(
        tap(_ => console.log(`updated data id=${(data as any)?.id}`)),
        catchError(this.handleError<SVItem>(`update(id=${(data as any)?.id}) from ${this.apiUrl}`))
      );
  }

  /**
   * DELETE: delete the generic data from the server.
   * The generic data can either be identified by its ID or the data itself.
   * @param data the generic data to be deleted.
   */
  delete(data: SVItem | number): Observable<SVItem> {
    const id = typeof data === 'number' ? data : (data as any).id;
    console.log(`DataService: delete((data as any).id=${id}): ${this.apiUrl}`);

    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`deleted data id=${id}`)),
        catchError(this.handleError<SVItem>(`delete(id=${(data as any).id}) from ${this.apiUrl}`))
      );
  }

  /**
   * GET the entire AdminSchluesselverzeichnis table and build the cache.
   */
  private buildCache(): void {
    const url = `${this.apiUrl}`;
    this.http.get<SVItem[]>(url)
      .pipe(
        // tap(item => console.log(`get data from ${url}`)),
      ).subscribe(list => {

      let svItems: SVItem[] = [];
      for (const svGroup of Object.keys(SVMap)) {
        if (!isNaN(Number(svGroup))) {
          svItems = list.filter(i => i.fkAdminSchluesselgruppe === +svGroup);
          this.cache.set(+svGroup, svItems);
        }
        // console.log(this.cacheLookup(+svGroup));
      }
    });
  }

  // **************************************************************************
  // CRUD Operations end
  // **************************************************************************

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<S>(operation: string = 'operation', result?: SVItem): (error: any) => Observable<SVItem> {
    return (error: any): Observable<SVItem> => {

      // TODO: send the error to remote logging infrastructure
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
