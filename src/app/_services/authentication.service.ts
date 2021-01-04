import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserAccountData} from '@/_models/user-account-data';
import {EnvironmentService} from '@/_services/environment.service';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<UserAccountData>;
  private currentUserSubject: BehaviorSubject<UserAccountData>;
  // URL to web api
  private readonly endPoint = 'UserAccount';
  private readonly apiUrl = this.env.apiUrl + this.endPoint;

  constructor(private http: HttpClient,
              private env: EnvironmentService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get isLoggedIn(): boolean {
    // Der Vergleich sollte so bleiben, bis das Login korrekt
    // implementiert wurde, weil sonst der Tree nicht sichtbar ist.
    return this.currentUserValue != null;
  }

  public get currentUserValue(): UserAccountData {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserAccountData> {
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, {username, password})
    // console.log(`AuthenticationService: login(): ${username} - ${password}`);
    const probe: UserAccountData = new UserAccountData();
    probe.username = username;
    probe.passwort = password ? password : null;

    console.log(`AuthenticationService: login(): ${probe.username} - ${probe.passwort}`);

    return this.http.post<any>(`${this.apiUrl}/authenticate`, probe)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
