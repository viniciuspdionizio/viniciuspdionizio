import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  name: string;
  icon: string;
  level?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-grid.component.html',
  styleUrl: './skills-grid.component.sass'
})
export class SkillsGridComponent {
  @Input({ required: true }) categories: SkillCategory[] = [];
}
