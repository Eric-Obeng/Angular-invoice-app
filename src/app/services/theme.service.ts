import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark'
  );

  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    this.isDarkMode$.subscribe((isDark) => {
      if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  switchTheme() {
    this.darkMode.next(!this.darkMode.value);
  }
}
