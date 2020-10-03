import { PopoverController } from '@ionic/angular';

export const presentPopover = async (popoverController: PopoverController, event: any, component, componentProps?,  width?) => {
    const popover = await popoverController.create({
      component,
      componentProps,
      event,
      translucent: true,
      animated:false
    });
    if(width !== null) {
        popover.style.setProperty('--min-width', width);
    }
    await popover.present();
    return popover.onWillDismiss();
  }