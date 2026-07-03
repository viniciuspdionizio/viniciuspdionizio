import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.sass'
})
export default class AboutComponent {
  stats = [
    { label: 'Foco de Atleta', detail: 'Foco, Disciplina e Resiliência' },
    { label: 'Stack Principal', detail: 'Angular, TS, Tailwind' },
    { label: 'Resolução', detail: 'Calma sob pressão' }
  ];
}
