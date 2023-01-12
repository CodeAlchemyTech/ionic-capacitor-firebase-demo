import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { LOCALSTORAGE_KEYS } from '../utils/common-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _navSvc: NavigationService) {}

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (localStorage.getItem(LOCALSTORAGE_KEYS.uid)) {
      return true;
    }
    this._navSvc.navigateForward('login');
    return false;
  }
}
