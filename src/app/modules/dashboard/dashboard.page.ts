import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserDetail } from 'src/app/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { UiService } from 'src/app/services/ui.service';
@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public userDetails!: UserDetail;
  constructor(
    private _authService: AuthService,
    private _uiService: UiService,
    private _alertCtrl: AlertController,
    private _navigationService: NavigationService
  ) {}

  async ngOnInit() {
    await this._uiService.presentLoading();
    this._authService.userDetails$.pipe(untilDestroyed(this)).subscribe(
      (data) => {
        this.userDetails = data as UserDetail;
        this._uiService.dismissLoading();
      },
      () => {
        this._uiService.dismissLoading();
      }
    );
  }

  async logout() {
    this._uiService
      .confirmAlert({
        title: 'Confirm!',
        message: 'Are you sure, You want to logout from app?!!',
        confirmBtnText: 'Logout',
      })
      .then(async (res): Promise<boolean | undefined> => {
        if (res) {
          await this._uiService.presentLoading('Please wait...');
          await this._authService.signOut();
          await this._uiService.dismissLoading();
          return this._navigationService.logout();
        } else {
          return false;
        }
      })
      .catch((e) => console.log(e));
  }
}
