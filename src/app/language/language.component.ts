import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language } from '../models/languages.model';
import { Translation } from '../translation';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './language.component.html',
  styleUrl: './language.component.less'
})
export class LanguageComponent {
  @Input() savedLanguage!: Language;
  @Input() translation!: Translation;


  selectedCulture: string = '';

  constructor() { }

  @Output() languageRemoved = new EventEmitter<string>();

  removeLanguage(): void {
    if (this.savedLanguage) {
      this.languageRemoved.emit(this.savedLanguage.iso);
    }
  }
}
