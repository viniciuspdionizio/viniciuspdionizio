import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsGridComponent, SkillCategory } from './skills-grid.component';

describe('SkillsGridComponent', () => {
  let component: SkillsGridComponent;
  let fixture: ComponentFixture<SkillsGridComponent>;

  const categories: SkillCategory[] = [
    {
      title: 'Front-End',
      skills: [
        { name: 'Angular', icon: 'bi bi-code-slash', level: 'Intermediário' },
        { name: 'TypeScript', icon: 'bi bi-filetype-tsx' },
      ],
    },
    {
      title: 'Back-End',
      skills: [{ name: 'Java', icon: 'bi bi-filetype-java', level: 'Intermediário' }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one card per category', () => {
    const titles = (fixture.nativeElement as HTMLElement).querySelectorAll('h4');
    expect(titles.length).toBe(categories.length);
    expect(titles[0].textContent).toContain('Front-End');
    expect(titles[1].textContent).toContain('Back-End');
  });

  it('should render every skill name within its category', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Angular');
    expect(text).toContain('TypeScript');
    expect(text).toContain('Java');
  });

  it('should only render the level badge when the skill has one', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    // 'Intermediário' aparece para Angular e Java, mas TypeScript não tem level.
    expect((text.match(/Intermediário/g) ?? []).length).toBe(2);
  });

  it('should render nothing when there are no categories', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    const titles = (fixture.nativeElement as HTMLElement).querySelectorAll('h4');
    expect(titles.length).toBe(0);
  });
});
