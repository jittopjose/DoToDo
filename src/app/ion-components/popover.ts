import { PopoverController } from '@ionic/angular';

export const presentPopover = async (popoverController: PopoverController, event: any, component, componentProps?,  width?) => {
    const popover = await popoverController.create({
      component,
      componentProps,
      event,
      translucent: true,
    });
    if(width) {
        popover.style.setProperty('--width', width);
    }
    await popover.present();
    return popover.onWillDismiss();
  }