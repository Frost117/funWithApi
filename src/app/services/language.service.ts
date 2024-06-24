import { Injectable } from '@angular/core';
import { Language } from '../models/language.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  baseUrl = 'https://funwithapis-4kbqnvs2ha-uc.a.run.app';

  languageUrl = this.baseUrl + '/v1/allLanguages/';

  constructor(private http: HttpClient) { }

  getLanguages(isoCode: string): Observable<Record<string, Language>>{

    isoCode = isoCode || window.navigator.language;

    return this.http.get<Record<string, Language>>(this.languageUrl + isoCode).pipe(
      map((response: Record<string, Language>) => {
        let languageRecord: Record<string, Language> = {};
        for (let key in response) {
          languageRecord[key] = {...response[key], iso: key};
        }
        return languageRecord;
      })
    );
  }

}
