import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private loading!: HTMLIonLoadingElement;
  constructor(
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtl: AlertController
  ) {}

  /**
   *
   * @uses
   * Used to show loading component with specific message
   * @param message @type string(optional)
   *
   * @returns `Promise<void>`
   */
  public async presentLoading(message?: string): Promise<void> {
    this.loading = await this._loadingCtrl.create({
      message,
      spinner: 'dots',
      keyboardClose: true,
      cssClass: 'custom-loader',
    });
    return await this.loading.present();
  }

  /**
   *
   * @uses
   * Used to hide already showed loading component
   *
   * @returns `Promise<boolean>
   */
  public async dismissLoading(): Promise<boolean> {
    if (this.loading) {
      return await this.loading.dismiss();
    } else {
      return false;
    }
  }
  /**
   *
   * @uses
   * - Used to show message in toast with specific color.
   *
   * @param message
   * @param color
   */
  public async showToast(message: string, color = 'success') {
    const toast = await this._toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    toast.present();
  }

  /**
   *
   * @uses
   * - Used to show confirmation alert dialog box to user.
   * - If user confirm it. Promise will resolve otherwise it rejects.
   *
   * @param @`{
   *  title: string;
   *  message: string;
   *  confirmBtnText?: string;
   *  cancelBtnText?: string;
   *  }`
   *
   * @returns
   */
  public confirmAlert({
    title,
    message,
    confirmBtnText,
    cancelBtnText,
  }: {
    title: string;
    message: string;
    confirmBtnText?: string;
    cancelBtnText?: string;
  }): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this._alertCtl.create({
        header: title,
        message,
        buttons: [
          {
            text: cancelBtnText || 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => reject(false),
          },
          {
            text: confirmBtnText || 'Confirm',
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }
}
