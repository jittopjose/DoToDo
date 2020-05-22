import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Setting } from '../models/setting';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { convertYYYYMMDD } from '../utilities/utility';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private _settings = new BehaviorSubject<Setting[]>([]);

  constructor(private dbService: NgxIndexedDBService) { }

  get settings() {
    return this._settings.asObservable();
  }

  async initSettings() {
    let taskSchedulerRunDateSetting = await this.getSetting('taskSchedulerRunDate');
    let pendingTaskCopyRunDateSetting = await this.getSetting('pendingTaskCopyRunDate');
    let autoImportPendingTasksSetting = await this.getSetting('autoImportPendingTasks');
    let initNotificationsSummaryRunDateSetting = await this.getSetting('initNotificationsSummaryRunDate');
    if(taskSchedulerRunDateSetting === undefined) {
      taskSchedulerRunDateSetting = {
        id: -1,
        name: 'taskSchedulerRunDate',
        value: convertYYYYMMDD(new Date().setDate(new Date().getDate() -1))
      }
      await this.addSetting(taskSchedulerRunDateSetting);
    }
    if(pendingTaskCopyRunDateSetting === undefined) {
      pendingTaskCopyRunDateSetting = {
        id: -1,
        name: 'pendingTaskCopyRunDate',
        value: convertYYYYMMDD(new Date().setDate(new Date().getDate() -1))
      }
      await this.addSetting(taskSchedulerRunDateSetting);
    }
    if(autoImportPendingTasksSetting === undefined) {
      autoImportPendingTasksSetting = {
        id: -1,
        name: 'autoImportPendingTasks',
        value: 'false'
      }
      await this.addSetting(autoImportPendingTasksSetting);
    }
    if(initNotificationsSummaryRunDateSetting === undefined) {
      initNotificationsSummaryRunDateSetting = {
        id: -1,
        name: 'initNotificationsSummaryRunDate',
        value: convertYYYYMMDD(new Date().setDate(new Date().getDate() -1))
      }
      await this.addSetting(initNotificationsSummaryRunDateSetting);
    }
  }

  async loadSettings() {
    const settings:Setting[] = await this.dbService.getAll('settings');
    this._settings.next(settings);
  }

  async getSetting(name: string){
    const setting:Setting = await this.dbService.getByIndex('settings', 'name', name);
    return setting;
  }

  async addSetting(setting: Setting) {
    const settingToAdd = {...setting};
    delete settingToAdd.id;
    const settingId = await this.dbService.add('settings', settingToAdd);
    setting.id = settingId;
    const settings = this._settings.value;
    this._settings.next(settings.concat(setting));
  }

  async updateSetting(setting: Setting) {
    await this.dbService.update('settings', setting);
    const settings = this._settings.value;
    const index = settings.findIndex(s => s.id === setting.id);
    settings[index] = setting;
    this._settings.next(settings);
  }
}
