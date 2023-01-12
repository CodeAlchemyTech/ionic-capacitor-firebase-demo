import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private navController: NavController) {}

  navigateForward(url: string, root: boolean = false) {
    if (root) {
      return this.navController.navigateRoot(url, {
        animated: true,
        animationDirection: 'forward',
      });
    }

    return this.navController.navigateForward(url);
  }

  navigateBack(url: string) {
    return this.navController.navigateBack(url);
  }

  /**
   * @usage let navigtionExtras: NavigationExtras = { state: object };
   * @param url @type string
   * @param object @type object
   */
  navigateForwardWithExtras(url: string, object: object) {
    const navigtionExtras: NavigationExtras = {
      state: object,
    };
    return this.navController.navigateForward([url], navigtionExtras);
  }

  back(remove: boolean = true) {
    if (remove) {
      return this.navController.pop();
    }
    return this.navController.back();
  }

  logout() {
    return this.navController.navigateRoot('/login', {
      animated: true,
      animationDirection: 'back',
    });
  }
}
