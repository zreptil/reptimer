import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthenticationService} from '@/_services/authentication.service';
import {EnvironmentService} from '@/_services/environment.service';
import {ClassEPMap} from '@/_models/class-epmap';

/**
 * Generic service class for all kind of data access to backend
 *
 * Implements the CRUD Methods create(), read(), update(), delete() and getList()
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  /**
   * Constructor for generic data service
   * @param http the HttpClient used for REST API calls
   * @param as Instance of Authenticationservice
   * @param ss Instance of SessionService
   * @param env Service with access to the environment
   */
  constructor(
    private http: HttpClient,
    private as: AuthenticationService,
    private env: EnvironmentService
  ) {
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
  getList<T>(type: ClassEPMap<T>, probe: T = null): Observable<T[]> {
    if (!probe) {
      probe = {} as T;
    }
    (probe as any).fkUserMandant = this.as.currentUserValue.fkUserMandant;
    (probe as any).deleted = 0;
    return this.getListByMatcher(type, probe);
  }

  /**
   * GET a list of generic data from the server.
   * Returns either a list of generic data entries or in case of an error
   * an empty list and lets the app keep running.
   */
  getListByMatcher<T>(type: ClassEPMap<T>, probe: T): Observable<T[]> {
    const url = `${this.env.apiUrl}${type.endpoint}/matching`;
    // console.log(`DataService: getList: ${url}`);
    return this.http.post<T[]>(url, probe, this.httpOptions)
      .pipe(
        map(list => {
          const ret = list.map((item: T) => {
            return type.classify(item);
          });
          return ret;
        }),
        // tap(_ => console.log(`fetched ${url} - with Probe: `,  probe)),
        // catchError(this.handleError<T>('create'))
      );

    // return this.http.get<T[]>(url)
    //   .pipe(
    //     tap(_ => console.log(`fetched ${url} List`)),
    //     // catchError(this.handleError<T>('getList'))
    //   );
  }

  // getListForEndpoint(endPoint: string): Observable<any[]> {
  //   const url = environment.production
  //     ? environment.guiUrl + '/api/database-service/' + endPoint
  //     : environment.guiUrl + '/' + endPoint;
  //
  //   console.log(`DataService: getListForEndpoint: ${url}`);
  //
  //
  //
  //   // const url = `${this.apiUrl}`;
  //   return this.http.get<any[]>(url)
  //     .pipe(
  //       tap(_ => console.log(`fetched ${url} List`)),
  //       // catchError(this.handleError<any[]>('getListForEndpoint'))
  //     );
  // }

  // private parse<T>(data: T): string {
  //   const ret: string = JSON.stringify(data);
  //
  //   return ret;
  // }


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
    return this.http.post<T>(url, data, this.httpOptions)
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        tap((newData: T) => console.log(`created data w/ id=${(newData as any).id}`)),
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
    return this.http.get<T>(url)
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        tap(_ => console.log(`get data for id=${id} from ${url}`)),
        catchError(this.handleError<T>(`get(id=${id}) from ${url}`))
      );
  }

  /**
   * PUT: update an existing generic data entry on the server.
   * @param type typeinformation for the data
   * @param data the generic data to be updated.
   */
  update<T>(type: ClassEPMap<T>, data: T): Observable<T> {
    // TODO: Todeshack der Hölle
    // wenn id == null -> create
    if (!(data as any)?.id) {
      console.log(`ID: ${(data as any).id}`);
      return this.create(type, data);
    }
    // const url = `${this.apiUrl}${type.endpoint}`;
    const url = `${this.env.apiUrl}${type.endpoint}/${(data as any)?.id}`;
    // const url = `${environment.guiUrl}/${type.endpoint}`;
    console.log(`DataService: update(id=${(data as any)?.id}) from ${url}`);
    return this.http.put<T>(url, data, this.httpOptions)
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        tap(_ => console.log(`updated data id=${(data as any)?.id}`)),
        catchError(this.handleError<T>(`update(id=${(data as any)?.id}) from ${url}`))
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
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        map(src => {
          return type.classify(src);
        }),
        tap(_ => console.log(`deleted data id=${id}`)),
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
