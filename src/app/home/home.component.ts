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
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, 
    CdkDrag,
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
  languageList: Record<string, Language> = {}; 
  preferredLanguage: string = window.navigator.language;
  savedLanguageList: Language[] = [];
  selectedLanguage: Language | null = null;

  constructor(private languageService: LanguageService) {
    this.languageService.getLanguages(this.preferredLanguage).subscribe((languageList: Record<string, Language>) => {
      this.languageList = languageList
    })
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
      map(isoCodes => isoCodes ? this._filterLanguages(isoCodes) : Object.values(this.languageList))
    );
    
    this.languageCtrl.valueChanges.subscribe(value => {
      this.selectedLanguage = this.savedLanguageList[value]
    });
  }

displayFn(language: Language): string {
  return language && language.languageIsoCodesWithLocales ? Object.values(language.languageIsoCodesWithLocales)[0] : '';
}

  saveLanguage(): void {
    if (this.selectedLanguage) {
      this.savedLanguageList.push(this.selectedLanguage);
      localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
    }
  }

  onLanguageRemoved(isoCode: string): void {
    const languageToRemoveIndex = this.savedLanguageList.findIndex(language => 
      Object.keys(language.languageIsoCodesWithLocales).includes(isoCode)
    );
    if (languageToRemoveIndex !== -1) {
      this.savedLanguageList.splice(languageToRemoveIndex, 1);
      localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
      this.onLanguagePreferred();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.savedLanguageList, event.previousIndex, event.currentIndex);
    localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
    this.onLanguagePreferred();
  }

  onLanguagePreferred(): void {
    if (this.savedLanguageList.length > 0) {
      this.preferredLanguage = Object.keys(this.savedLanguageList[0].languageIsoCodesWithLocales)[0];
    } else {
      this.preferredLanguage = '';
    }
  }

  private _getIsoCodes(language: Language): string {
    return language.iso;
  }

  private _filterLanguages(value: string): Language[] {
    const filterValue = value.toLowerCase();
    return Object.values(this.languageList).filter(language => 
      language.iso.toLowerCase().includes(filterValue) || 
      Object.values(language.languageIsoCodesWithLocales)[0].toLowerCase().includes(filterValue)
    );
  }
}
