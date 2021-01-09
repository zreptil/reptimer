import {UserData} from '@/_models/user-data';

export class LoginData {
  id: string;
  username: string;
  password: string;
  tfacode: string;
  tfaurl: string;
  user = new UserData();
}
