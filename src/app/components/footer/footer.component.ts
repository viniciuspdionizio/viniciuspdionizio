import { Component, inject, isDevMode, OnInit } from '@angular/core';
import { versionInfo } from '../../version-info';
import { socials } from '../utils/socials';
import { DatePipe } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  protected readonly scrollService = inject(ScrollService);

  readonly versionInfo = versionInfo;
  currentYear = new Date().getFullYear();

  socials = socials;

  ngOnInit() {
    // Ajuda a conferir a versão publicada durante o desenvolvimento;
    // não aparece no console em produção.
    if (isDevMode()) {
      console.log('Version Info:', this.versionInfo);
    }
  }
}
