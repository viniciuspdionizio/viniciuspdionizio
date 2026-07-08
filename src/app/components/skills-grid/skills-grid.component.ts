import { Component, Input } from '@angular/core';


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
    imports: [],
    templateUrl: './skills-grid.component.html',
    styleUrl: './skills-grid.component.scss'
})
export class SkillsGridComponent {
  @Input({ required: true }) categories: SkillCategory[] = [];
}
