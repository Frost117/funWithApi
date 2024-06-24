import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    RouterModule
  ],
  template: `
    <main>
      <section>
        <router-outlet></router-outlet>
      </section>
    </main>
      `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'funWithApi';
}
