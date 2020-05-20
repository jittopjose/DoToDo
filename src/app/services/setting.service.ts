import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Setting } from '../models/setting';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private _settings = new BehaviorSubject<Setting[]>([]);

  constructor(private dbService: NgxIndexedDBService) { }

  get settings() {
    return this._settings.asObservable();
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
