import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { UiService } from 'src/app/services/ui.service';
import { ValidationHelper } from 'src/app/services/validation-helper.service';

type SocialAuthType = 'apple' | 'google' | 'facebook' | 'twitter';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  public showPassword = false;
  constructor(
    private _formBuilder: FormBuilder,
    public validationHelper: ValidationHelper,
    private _navigationService: NavigationService,
    private _authService: AuthService,
    private _uiService: UiService,
    private _firestoreService: FirestoreService
  ) {}
  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.loginForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    this._navigationService.navigateForward('/register');
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        await this._uiService.presentLoading();
        await this._authService.signinWithEmail(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        await this._uiService.dismissLoading();
        this._navigationService.navigateForward('dashboard', true);
      } catch (e) {
        this._authService.authError(e);
        this._uiService.dismissLoading();
      }
    }
  }

  async socialLogin(type: SocialAuthType): Promise<void> {
    try {
      await this._uiService.presentLoading();
      let user = null;
      if (type === 'google') {
        user = await this._authService.signInWithGoogle();
      } else if (type === 'facebook') {
        user = await this._authService.signInWithFacebook();
      } else if (type === 'twitter') {
        user = await this._authService.signInWithTwitter();
      } else {
        user = await this._authService.signInWithApple();
      }
      await this._firestoreService.saveUserData(
        user.user?.uid ?? '',
        user.user as UserDetail
      );
      await this._uiService.dismissLoading();
      this._navigationService.navigateForward('dashboard', true);
    } catch (e) {
      console.log('auth error', e);
      this._authService.authError(e);
      this._uiService.dismissLoading();
    }
  }
}
