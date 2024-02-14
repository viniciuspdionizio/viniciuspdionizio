import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LupumButton } from './directives/lupum-button.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LupumButton, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {
  }

  onClick(event: any) {
    this.router.navigate(['']);
  }



}
