import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

import { NavigationService } from 'src/app/services/navigation.service';
import { UiService } from 'src/app/services/ui.service';
import { ValidationHelper } from 'src/app/services/validation-helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm!: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    public validationHelper: ValidationHelper,
    private _uiService: UiService,
    private _authSvc: AuthService,
    private _firestoreService: FirestoreService,
    private _navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.registerForm = this._formBuilder.group(
      {
        fullname: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmpassword: ['', [Validators.required]],
      },
      {
        validator: this.validationHelper.confirmedValidator(
          'password',
          'confirmpassword'
        ),
      }
    );
  }

  async register() {
    if (this.registerForm.valid) {
      try {
        await this._uiService.presentLoading();
        const user = await this._authSvc.signupWithEmail(
          this.registerForm.value.email,
          this.registerForm.value.password
        );
        const userDetail: UserDetail = {
          ...(user.user as UserDetail),
          displayName: this.registerForm.value.fullname,
        };
        await this._firestoreService.saveUserData(
          user.user?.uid ?? '',
          userDetail
        );
        await this._uiService.dismissLoading();
        this._navigationService.navigateForward('dashboard', true);
      } catch (e) {
        this._authSvc.authError(e);
        this._uiService.dismissLoading();
      }
    }
  }
}
