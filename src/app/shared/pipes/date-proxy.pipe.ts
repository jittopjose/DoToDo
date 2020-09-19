import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'date'
})
export class DateProxyPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }
  
    public transform(value: any, pattern: string = 'mediumDate'): any {
      const ngPipe = new DatePipe(this.translate.currentLang);
      return ngPipe.transform(value, pattern);
    }

}
