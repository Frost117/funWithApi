import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../language/language.component';
import { LanguageService } from '../services/language.service';
import { Language } from '../models/languages.model';
import { FormsModule} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule} from '@angular/material/icon';
import { MatDividerModule} from '@angular/material/divider';
import { MatButtonModule} from '@angular/material/button';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
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
export class HomeComponent {

  selectedLanguage: string = '';
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
  }

  saveLanguage(): void {
    if (this.preferredLanguage) {
      const languageToSave = this.languageList.find(language => 
        Object.keys(language.languageIsoCodesWithLocales).includes(this.preferredLanguage)
      );
      if (languageToSave && !this.savedLanguageList.includes(languageToSave)) {
        this.savedLanguageList.push(languageToSave);
        localStorage.setItem('savedLanguageList', JSON.stringify(this.savedLanguageList));
      }
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
}
