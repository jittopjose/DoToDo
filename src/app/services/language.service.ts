import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService) { }

  setInitialAppLanguage(){
    this.translate.addLangs(['en', 'fr', 'nl']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    console.log(browserLang);
    this.setLanguage(browserLang.match(/en|fr|nl/) ? browserLang : 'en');
  }

  setLanguage(language) {
    this.translate.use(language);
  }
}
