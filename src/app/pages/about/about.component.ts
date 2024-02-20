import { DOCUMENT, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomButtonDirective } from '../../directives/custom-button.directive';
import ContactComponent from '../contact/contact.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ContactComponent,
    CustomButtonDirective,
    MatButtonModule,
    NgOptimizedImage,
    MatCardModule,
    MatIconModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.sass'
})
export default class AboutComponent {
  menuOpened: boolean = false;

  constructor(private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => this.navigateToId(fragment));
    this.document.getElementById('texto')?.focus();

  }

  ngAfterViewInit(): void {
  }

  navigateToId(id: string | null) {
    this.document.querySelector(`#${id}`)?.scrollIntoView();
  }

}
