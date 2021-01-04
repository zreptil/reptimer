import {Injectable, isDevMode} from '@angular/core';

/*
  @class ShowDebugInfoService

  Informs visual elements if they should show debug info (e.g. current values of their form controls).

  Only show debug info on client if in dev mode and if it is allowed.
 */
@Injectable({
  providedIn: 'root'
})
export class ShowDebugInfoService {

  private isDevMode = isDevMode();
  // tslint:disable-next-line:variable-name
  private _allowInfoOnClient = true;

  constructor() {
  }

  // @ts-ignore
  public set allowInfoOnClient(val: boolean) {
    this._allowInfoOnClient = val;
  }

  public get allowInfoOnClient(): boolean {
    return this._allowInfoOnClient;
  }

  public showDebugInfoOnClient(): boolean {
    // return isDevMode() && this.allowInfoOnClient;
    return false;
  }
}

