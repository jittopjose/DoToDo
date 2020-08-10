import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService) { }

  setInitialAppLanguage(){
    this.translate.setDefaultLang('en');
    const language = this.translate.getBrowserLang();
    console.log(language);
    this.setLanguage(language);
  }

  setLanguage(language) {
    this.translate.use(language);
  }
}
