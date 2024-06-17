import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../language/language.component';
import { LanguageService } from '../services/language.service';
import { Language } from '../models/languages.model';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule} from '@angular/material/icon';
import { MatDividerModule} from '@angular/material/divider';
import { MatButtonModule} from '@angular/material/button';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    CommonModule,
    MatGridListModule,
    LanguageComponent,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit{

  languageCtrl = new FormControl();
  filteredLanguages!: Observable<Language[]>;
  languageList: Language[] = []; 
  preferredLanguage: string = window.navigator.language;
  savedLanguageList: Language[] = [];

  constructor(private languageService: LanguageService) {

    this.languageService.getLanguages(this.preferredLanguage).subscribe((languageList: Language[]) => {
      this.languageList = languageList;
    });    
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(): void {
    const savedLanguageList = localStorage.getItem('savedLanguageList');
    if (savedLanguageList) {
      this.savedLanguageList = JSON.parse(savedLanguageList);
    }

    this.filteredLanguages = this.languageCtrl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this._getIsoCodes(value)),
      map(isoCodes => isoCodes ? this._filterLanguages(isoCodes) : this.languageList.slice())
    );
  }

  _getIsoCodes(language: Language): string {
    return language && language.languageIsoCodesWithLocales 
      ? Object.values(language.languageIsoCodesWithLocales).join(' ') 
      : '';
  }

  saveLanguage(): void {
    const languageToSave = this.languageCtrl.value;
    if (languageToSave && !this.savedLanguageList.includes(languageToSave)) {
      this.savedLanguageList.push(languageToSave);
      localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
      this.languageCtrl.reset();
    }
  }
  onLanguageRemoved(isoCode: string): void {
    const languageToRemoveIndex = this.savedLanguageList.findIndex(language => 
      Object.keys(language.languageIsoCodesWithLocales).includes(isoCode)
    );
    if (languageToRemoveIndex !== -1) {
      this.savedLanguageList.splice(languageToRemoveIndex, 1);
      localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
    }
  }

  onLanguagePreferred(isoCode: string): void {
    this.preferredLanguage = isoCode;
    this.languageService.getLanguages(this.preferredLanguage).subscribe((languageList: Language[]) => {
      this.languageList = languageList;
    });
  }

  displayFn(language: Language): string {
    return language && language.languageIsoCodesWithLocales[language.iso] ? language.languageIsoCodesWithLocales[language.iso] : '';
  }

  private _filterLanguages(isoCodes: string): Language[] {
    const filterValue = isoCodes.toLowerCase();
  
    return this.languageList.filter(language => 
      Object.values(language.languageIsoCodesWithLocales).some(isoCode => 
        isoCode.toLowerCase().includes(filterValue)
      )
    );
  }
}
