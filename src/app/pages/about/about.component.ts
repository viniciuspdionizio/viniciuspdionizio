import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    imports: [NgOptimizedImage],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export default class AboutComponent {
  stats = [
    { label: $localize`:@@about.stats.focus.label:Foco de Atleta`, detail: $localize`:@@about.stats.focus.detail:Foco, Disciplina e Resiliência` },
    { label: $localize`:@@about.stats.stack.label:Stack Principal`, detail: 'Java, Spring Boot, Angular, TypeScript' },
    { label: $localize`:@@about.stats.resolve.label:Resolução`, detail: $localize`:@@about.stats.resolve.detail:Calma sob pressão` }
  ];
}
