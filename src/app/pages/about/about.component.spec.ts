import { ComponentFixture, TestBed } from '@angular/core/testing';

import AboutComponent from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a non-empty list of stats with label and detail', () => {
    expect(component.stats.length).toBeGreaterThan(0);
    component.stats.forEach((stat) => {
      expect(stat.label).toBeTruthy();
      expect(stat.detail).toBeTruthy();
    });
  });

  it('should render the profile image with accessible alt text', () => {
    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.alt).toBeTruthy();
  });
});
