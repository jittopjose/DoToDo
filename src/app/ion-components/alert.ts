import { AlertController } from '@ionic/angular';

export const presentAlertConfirm = async (
            alertController: AlertController, message, header, cancelText,
            confirmText, width, inputs): Promise<{result:boolean, data:any}> => {
    let resolveFunction: (confirm: {result:boolean, data:any}) => void;
    const promise = new Promise<{result:boolean, data:any}>(resolve => {
        resolveFunction = resolve;
      });
    const alert = await alertController.create({
      header,
      message,
      inputs,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => resolveFunction({result: false, data})
        }, {
          text: confirmText,
          handler: (data) => resolveFunction({result: true, data})
        }
      ],
      animated:false
    });
    if(width !== null) {
      alert.style.setProperty('--min-width', width);
    }
    await alert.present();
    return promise;
  };

  export const presentAlertTaskCopyConfirm = async (alertController: AlertController, message, header): Promise<boolean> => {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
        resolveFunction = resolve;
      });
    const alert = await alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Ignore',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolveFunction(false)
        }, {
          text: 'Yes',
          handler: () => resolveFunction(true)
        }
      ],
      animated: false
    });

    await alert.present();
    return promise;
  };

  export const presentAlertTaskToggleDoneConfirm = async (alertController: AlertController, message, header): Promise<boolean> => {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
        resolveFunction = resolve;
      });
    const alert = await alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolveFunction(false)
        }, {
          text: 'Yes',
          handler: () => resolveFunction(true)
        }
      ]
    });

    await alert.present();
    return promise;
  };