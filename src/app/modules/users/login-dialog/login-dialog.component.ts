import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {LoginData} from '@/_models/login-data';
import {DataService} from '@/_services/data.service';
import {MatDialogRef} from '@angular/material/dialog';
import {UserData} from '@/_models/user-data';
import {SessionService} from '@/_services/session.service';
import {CEM} from '@/_models/cem';
import {Md5} from 'ts-md5';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['../../../core/components/dialog/dialog.component.css',
        './login-dialog.component.css'],
    standalone: false
})
export class LoginDialogComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public registerForm: UntypedFormGroup;
  public tfaForm: UntypedFormGroup;

  public loginData = {
    username: [null, Validators.required],
    password: [null, Validators.required],
    tfacode: [null, Validators.required]
  };

  public registerData = {
    username: [null, [Validators.required, Validators.minLength(4)]],
    fullname: null,
    email: null,
    password: [null, [Validators.required, Validators.minLength(4)]],
    user: new UserData()
  };

  public tfaData = {
    tfacode: null
  };

  type: string;
  tfaurl: string;
  txtError: string;

  constructor(private ss: SessionService,
              private fb: UntypedFormBuilder,
              private ds: DataService,
              public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.type = 'login';
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group(this.loginData);
    this.registerForm = this.fb.group(this.registerData);
    this.tfaForm = this.fb.group(this.tfaData);
  }

  loginClick(): void {
    this.loginData.username = this.loginForm.get('username').value;
    this.loginData.password = Md5.hashStr(this.loginForm.get('password').value) as any;
    this.loginData.tfacode = this.loginForm.get('tfacode').value;
    this.ds.post(CEM.Login, 'login', this.loginData).subscribe((data: LoginData) => {
      this.ss.session.cfg.authorization = data.id;
      this.ss.saveConfig();
      this.ss.setUser(data.user);
      this.loginDone();
    }, error => {
      if (error.status === 401) {
        this.txtError = $localize`Die Daten sind nicht korrekt.`;
      } else {
        this.txtError = error.message;
      }
    });
  }

  tfaClick(): void {
    console.log('tfacheck', this.ss.session.cfg.authorization);
    this.ds.post(CEM.Login, 'tfacheck', {tfacheck: this.tfaForm.get('tfacode').value} as any).subscribe((data: any) => {
      console.log('tfacheck result', data);
      this.tfaurl = null;
      this.ss.session.user = data;
      this.loginDone();
    }, _error => {
      this.txtError = $localize`Der Code ist nicht korrekt`;
    });
  }

  loginDone(): void {
    this.dialogRef.close();
  }

  registerClick(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.registerData.username = this.registerForm.get('username').value;
    this.registerData.user.fullname = this.registerForm.get('fullname').value;
    this.registerData.password = Md5.hashStr(this.registerForm.get('password').value) as any;
    this.type = 'qrcode';
    this.ds.post(CEM.Login, 'register', this.registerData).subscribe((data: LoginData) => {
      this.tfaurl = data.tfaurl;
      this.ss.session.cfg.authorization = data.id;
      console.log('userkey', this.ss.session.cfg.authorization);
      this.ss.saveSession();
      console.log('register:', data);
    }, error => {
      this.type = 'register';
      console.log(error);
      this.txtError = error.error.error;
    });
  }

  toggleTypeClick(): void {
    switch (this.type) {
      case 'login':
        this.type = 'register';
        break;
      case 'register':
        this.type = 'login';
        break;
    }
  }
}

