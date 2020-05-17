import { AlertController } from '@ionic/angular';

export const presentAlertConfirm = async (alertController: AlertController, message): Promise<boolean> => {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
        resolveFunction = resolve;
      });
    const alert = await alertController.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolveFunction(false)
        }, {
          text: 'Okay',
          handler: () => resolveFunction(true)
        }
      ]
    });

    await alert.present();
    return promise;
  };