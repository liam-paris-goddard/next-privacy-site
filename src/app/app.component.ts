import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { Observable, Subject, filter, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'privacy-site-redesign';

  isAdminPage$: Observable<boolean>;
  constructor(private _router: Router) {
    this.isAdminPage$ = new Subject();
  }
  ngOnInit() {
    this.isAdminPage$ = this._router.events.pipe(
      filter((evt: any) => {
        return evt instanceof NavigationEnd;
      }),
      map((evt: NavigationEnd) => {
        return evt.url.includes('/admin');
      }),
    );
  }
}
