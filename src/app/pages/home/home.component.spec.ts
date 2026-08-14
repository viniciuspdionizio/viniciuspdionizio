import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import HomeComponent from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the full page (header, sections and footer) without throwing', () => {
    expect(() => fixture.detectChanges()).not.toThrow();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('app-header')).toBeTruthy();
    expect(host.querySelector('app-footer')).toBeTruthy();
    expect(host.querySelector('#home')).toBeTruthy();
    expect(host.querySelector('#skills')).toBeTruthy();
    expect(host.querySelector('#experience')).toBeTruthy();
  });

  it('should expose three skill categories with at least one skill each', () => {
    expect(component.skillsCategories.length).toBe(3);
    component.skillsCategories.forEach((category) => {
      expect(category.skills.length).toBeGreaterThan(0);
    });
  });

  it('should expose the timeline items used in the experience section', () => {
    expect(component.timelineItems.length).toBeGreaterThan(0);
    component.timelineItems.forEach((item) => {
      expect(['work', 'education', 'sports']).toContain(item.type);
    });
  });

  it('should not carry a dead/unused scrollToSection method (moved to ScrollService)', () => {
    expect((component as unknown as { scrollToSection?: unknown }).scrollToSection).toBeUndefined();
  });
});
