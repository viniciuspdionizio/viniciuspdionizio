import { Component } from '@angular/core';
import { LupumButton } from '../../directives/lupum-button.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    LupumButton,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export default class AboutComponent {

}
