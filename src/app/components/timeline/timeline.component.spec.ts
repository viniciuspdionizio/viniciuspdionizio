import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent, TimelineItem } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  const items: TimelineItem[] = [
    { role: 'Desenvolvedor', company: 'Peti9', period: '2024 - Presente', description: 'Full-stack.', type: 'work' },
    { role: 'Atleta', company: 'K1', period: '2014 - Presente', description: 'Kickboxing.', type: 'sports' },
    { role: 'Bacharel', company: 'FEMA', period: '2009 - 2022', description: 'Ciência da Computação.', type: 'education' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one entry per timeline item', () => {
    const roles = (fixture.nativeElement as HTMLElement).querySelectorAll('h4');
    expect(roles.length).toBe(items.length);
  });

  it('should render the role, company and description of each item', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    items.forEach((item) => {
      expect(text).toContain(item.role);
      expect(text).toContain(item.company);
      expect(text).toContain(item.description);
    });
  });

  it('should pick the icon that matches each item type', () => {
    const html = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(html).toContain('bi-briefcase'); // work
    expect(html).toContain('bi-trophy'); // sports
    expect(html).toContain('bi-mortarboard'); // education
  });

  it('should render nothing when there are no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    const roles = (fixture.nativeElement as HTMLElement).querySelectorAll('h4');
    expect(roles.length).toBe(0);
  });
});
