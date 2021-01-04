import {ISelectItem} from '@/visuals/model/iselectitem';

// TODO: Eigenschaften des TableItem mit table suffix versehen
export interface UserAccountTableItem {
  id: number;

  username: string;
  vorname: string;
  nachname: string;

  // Meta-Informationen für Anzeige in Liste
  hovered?: boolean;
}

export class UserAccountData implements UserAccountTableItem, ISelectItem {
  // ID and FKs
  idUserAccount: number;
  fkUserMandant: number;
  fkUserFiliale: number;
  fkUserRolle: number;

  // Meta-Data
  createtime: Date = null;
  createuser: string = null;
  locktime: Date = null;
  lockuser: string = null;
  modifytime: Date = null;
  modifyuser: string = null;
  deleted: number = null;
  readonly: number = null;

  // SV Keys

  email: string;
  nachname: string;
  passwort: string;
  passwortMbs: string;
  passwortSchufa: string;
  telefax: string;
  telefon: string;
  username: string;
  usernameMbs: string;
  usernameSchufa: string;
  vorname: string;

  // XML Values

  // Interface ISelectItem
  value: string;
  label: string;

  // Interface UserAccountTableItem
  id: number;

  // View Meta-Data
  dirty = false; // true if any changes have been made

  // Authorization-token
  token: string;
}
