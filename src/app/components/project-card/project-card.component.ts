import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

@Component({
    selector: 'app-project-card',
    imports: [CommonModule],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.sass'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
