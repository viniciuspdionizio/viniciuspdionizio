import { MediaMatcher } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  mobile: boolean = false;
  opened: boolean;

  constructor(
    private router: Router,
    private media: MediaMatcher,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.isMobile();
  }

  ngOnDestroy(): void {
  }

  @HostListener('window:resize')
  private isMobile() {
    this.mobile = this.media.matchMedia('(max-width: 1080px)').matches;
  }

  onClick(event: any) {
    this.router.navigate(['']);
  }



}
