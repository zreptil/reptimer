import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AuthenticationService} from '@/_services/authentication.service';
import {EnvironmentService} from '@/_services/environment.service';
import {ClassEPMap} from '@/_models/class-epmap';
import {StorageService} from '@/_services/storage.service';
import {CEM} from '@/_models/cem';

/**
 * Generic service class for all kind of data access to backend
 *
 * Implements the CRUD Methods create(), read(), update(), delete() and getList()
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * Constructor for generic data service
   * @param http the HttpClient used for REST API calls
   * @param as Instance of Authenticationservice
   * @param storage Instance of Storageservice
   * @param env Service with access to the environment
   */
  constructor(
    private http: HttpClient,
    private as: AuthenticationService,
    private storage: StorageService,
    private env: EnvironmentService
  ) {
  }

  private get httpHeaders(): HttpHeaders {
    const cfg = this.storage.read(CEM.Config);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: cfg?.authorization || ''
    });
  }

  // /**
  //  * PUT: update an existing generic data entry on the server.
  //  * @param data the generic data to be updated.
  //  */
  // updateDeep<T>(type: ClassEPMap<T>, data: T): Observable<T> {
  //   // const url = `${this.apiUrl}${type.endpoint}`;
  //   const url = `${this.apiUrl}${type.endpoint}/${(data as any)?.id}`;
  //   // const url = `${environment.guiUrl}/${type.endpoint}`;
  //   console.log(`DataService: update(id=${(data as any)?.id}) from ${url}`);
  //   return this.http.put<T>(url, data, this.httpOptions)
  //     .pipe(
  //       tap(_ => console.log(`updated data id=${(data as any)?.id}`)),
  //       catchError(this.handleError<T>(`update(id=${(data as any)?.id}) from ${url}`))
  //     );
  // }

  /**
   * GET a list of generic data from the server.
   * Returns either a list of generic data entries or in case of an error
   * an empty list and lets the app keep running.
   */
  getList<T>(type: ClassEPMap<T>, query?: any): Observable<T[]> {
    const url = `${this.env.apiUrl}${type.endpoint}/?q=${!query || query === '' ? '%' : query}`;
    return this.http.get<T[]>(url, {headers: this.httpHeaders})
      .pipe(
//        tap(_ => console.log(`fetched ${this.endPoint}List`)),
//        catchError(this.handleError<T>('getList'))
      );
  }

  /**
   * GET a list of generic data from the server.
   * Returns either a list of generic data entries or in case of an error
   * an empty list and lets the app keep running.
   */
  getListByMatcher<T>(type: ClassEPMap<T>, probe: T): Observable<T[]> {
    const url = `${this.env.apiUrl}${type.endpoint}`;
    // console.log(`DataService: getList: ${url}`);
    return this.http.post<T[]>(url, probe, {headers: this.httpHeaders})
      .pipe(
        map(list => {
          if (list == null) {
            return [];
          }
          const ret = list.map((item: T) => {
            return type.classify(item);
          });
          return ret;
        }),
      );
  }

  /**
   * POST: add a new generic data entry to the server
   * @param data the new generic data to be added.
   */
  post<T>(type: ClassEPMap<T>, cmd: string, data?: T): Observable<T> {
    const url = `${this.env.apiUrl}${type.endpoint}`;
    return this.http.post<T>(url, {cmd, data}, {headers: this.httpHeaders})
      .pipe(
//        tap((response: T) => console.log(`received data`)),
//        catchError(this.handleError<T>('post'))
      );
  }

  /**
   * GET generic data by command.
   * Will return 404 if no entry for id is found.
   * @param id - database ID for the requested generic data element
   */
  get<T>(type: ClassEPMap<T>, cmd: string): Observable<T> {
    const url = `${this.env.apiUrl}${type.endpoint}?cmd=${cmd}`;
//    console.log(`DataService: get(id=${id}): ${this.apiUrl}`);

    return this.http.get<T>(url, {headers: this.httpHeaders})
      .pipe(
//        tap(_ => console.log(`get data for id=${id} from ${this.apiUrl}`)),
        catchError(this.handleError<T>(`get(cmd=${cmd}) from ${url}`))
      );
  }

  // **************************************************************************
  // CRUD Operations
  // **************************************************************************

  /**
   * POST: add a new generic data entry to the server
   * @param type typeinformation for the data
   * @param data the new generic data to be added.
   */
  create<T>(type: ClassEPMap<T>, data: T): Observable<T> {
    const url = `${this.env.apiUrl}${type.endpoint}`;
    // const url = `${environment.guiUrl}/${type.endpoint}`;
    console.log(`DataService: create(data.id=${(data as any).id}): ${url}`);
    console.log(`DataService: create: ${JSON.stringify(data)}`);
    return this.http.post<T>(url, data, {headers: this.httpHeaders})
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        // tap((newData: T) => console.log(`created data w/ id=${(newData as any).id}`)),
        catchError(this.handleError<T>('create'))
      );
  }

  /**
   * GET generic data by id.
   * Will return 404 if no entry for id is found.
   * @param type typeinformation for the data
   * @param id - database ID for the requested generic data element
   */
  read<T>(type: ClassEPMap<T>, id: number): Observable<T> {
    const url = `${this.env.apiUrl}${type.endpoint}/${id}`;
    // const url = `${environment.guiUrl}/${type.endpoint}/${id}`;
    console.log(`DataService: get(id=${id}): ${url}`);
    return this.http.get<T>(url, {headers: this.httpHeaders})
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        // tap(_ => console.log(`get data for id=${id} from ${url}`)),
        catchError(this.handleError<T>(`get(id=${id}) from ${url}`))
      );
  }

  /**
   * PUT: update an existing generic data entry on the server.
   * @param type typeinformation for the data
   * @param data the generic data to be updated.
   */
  update<T>(type: ClassEPMap<T>, data: T): Observable<T> {
    const url = `${this.env.apiUrl}${type.endpoint}`;
    return this.http.put<T>(url, {cmd: 'update', data}, {headers: this.httpHeaders})
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        // tap(_ => console.log('updated', data)),
        catchError(this.handleError<T>('update'))
      );
  }

  /**
   * DELETE: delete the generic data from the server.
   * The generic data can either be identified by its ID or the data itself.
   * @param type typeinformation for the data
   * @param data the generic data to be deleted.
   */
  delete<T>(type: ClassEPMap<T>, data: T | number): Observable<T> {
    const id = typeof data === 'number' ? data : (data as any).id;
    const url = `${this.env.apiUrl}${type.endpoint}/${id}`;
    // const url = `${environment.guiUrl}/${type.endpoint}/${id}`;
    console.log(`DataService: delete((data as any).id=${id}): ${url}`);
    return this.http.delete<any>(url, {headers: this.httpHeaders})
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        // tap(_ => console.log(`deleted data id=${id}`)),
        catchError(this.handleError<T>(`delete(id=${(data as any).id}) from ${url}`))
      );
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
  private handleError<T>(operation: string = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`, error);

      // inform the app of the error
      throw new Error(error);
    };
  }
}
