import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineItem {
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'sports';
}

@Component({
    selector: 'app-timeline',
    imports: [CommonModule],
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  @Input({ required: true }) items: TimelineItem[] = [];
}
