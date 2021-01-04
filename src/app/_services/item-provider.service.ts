import {Injectable} from '@angular/core';
import {ISelectItem} from '@/visuals/model/iselectitem';
import {DataService} from '@/_services/data.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SVMap} from '@/core/classes/svmap.enum';
import {SVService} from '@/_services/sv.service';
import {AuthenticationService} from '@/_services/authentication.service';
import {EnvironmentService} from '@/_services/environment.service';
import {CEM} from '@/_models/cem';

export declare type ItemProviderFn = (ips: ItemProviderService, arg?: any) => Observable<ISelectItem[]>;

@Injectable({
  providedIn: 'root'
})
export class ItemProviderService {
  constructor(private ds: DataService,
              private as: AuthenticationService,
              private svService: SVService,
              private env: EnvironmentService) {
  }

  // static userAccount(ips: ItemProviderService): Observable<ISelectItem[]> {
  //   return ips.ds.getList(CEM.UserAccount)
  //     .pipe(
  //       map((list) => {
  //           return list.map(item => {
  //             const name = `${item.nachname}, ${item.vorname}`;
  //             return {value: `${item.idUserAccount}`, label: name};
  //           });
  //         }
  //       ));
  // }

  static svList(ips: ItemProviderService, arg: SVMap): Observable<ISelectItem[]> {
    return ips.svService.getList(arg)
      .pipe(
        map((list) => {
            return list.map(item => {
              return {value: `${item.svid}`, label: item.text};
            });
          }
        ));
  }

  static svItems(ips: ItemProviderService, arg: SVMap): Observable<any[]> {
    return ips.svService.getList(arg)
      .pipe(
        map((list) => {
            return list.map(item => {
              return item;
            });
          }
        ));
  }
}
