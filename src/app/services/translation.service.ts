import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation } from '../models/translation';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  baseUrl = 'https://funwithapis-4kbqnvs2ha-uc.a.run.app';

  languageUrl = this.baseUrl + '/v1/translations/';

  constructor(private http: HttpClient) { }

  getTranslation(isoCode: string): void{
    this.http.get<Translation>(this.languageUrl + isoCode)
  }

}
