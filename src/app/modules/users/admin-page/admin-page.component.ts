import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';
import {DataService} from '@/_services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {AdminUserData} from '@/_models/admin-user-data';
import {SessionService} from '@/_services/session.service';
import {CEM} from '@/_models/cem';
import {UserDialogComponent} from '@/modules/users/admin-page/user-dialog/user-dialog.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  public userList: Array<AdminUserData>;

  constructor(private fb: UntypedFormBuilder,
              private ss: SessionService,
              public dialog: MatDialog,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.dataService.getList(CEM.AdminUser).subscribe((list: AdminUserData[]) => {
      this.userList = list;
    });
  }

  displayName(user: AdminUserData): string {
    let ret = user.fullname;
    if (ret === '') {
      ret = user.username;
    }
    if (ret === '') {
      ret = $localize`<Leer>`;
    }

    return ret;
  }

  classForUser(user: AdminUserData): any {
    const ret = [];
    if (user.id === this.ss.session.cfg.authorization) {
      ret.push('active');
    }
    return ret;
  }

  userClick(user): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {data: user}).afterClosed();
    dialogRef.subscribe(result => {
      switch (result) {
        case 'save':
          console.log('user', user);
          this.dataService.update(CEM.AdminUser, user).subscribe((response: AdminUserData) => {
            if (response.id === this.ss.session.cfg.authorization) {
              this.ss.session.user = CEM.User.classify(response);
            }
          });
          break;
        case 'delete':
          this.dataService.delete(CEM.AdminUser, user).subscribe(_response => {
          });
          break;
        default:
          break;
      }
    });
  }
}
