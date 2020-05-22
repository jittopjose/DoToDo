import { Component, OnInit } from '@angular/core';
import * as icons from '../../constants/icons';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  backButtonIcon = icons.ionIcons.arrowBackOutline;
  autoImportPendingTasks = false;
  constructor(private settingService: SettingService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.initSettings();
  }

  async initSettings() {
    this.autoImportPendingTasks = await (await this.settingService.getSetting('autoImportPendingTasks')).value === 'true';
  }

  async onSettingChange(settingName, event) {
    const setting = await this.settingService.getSetting(settingName);
    if (setting.value !== String(event.detail.checked)) {
      setting.value = String(event.detail.checked)
      await this.settingService.updateSetting(setting);
    }
  }

}
