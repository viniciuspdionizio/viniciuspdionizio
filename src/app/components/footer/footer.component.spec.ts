import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { ScrollService } from '../../services/scroll.service';
import { socials } from '../utils/socials';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let scrollServiceSpy: jasmine.SpyObj<ScrollService>;

  beforeEach(async () => {
    scrollServiceSpy = jasmine.createSpyObj('ScrollService', ['scrollToSection']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: ScrollService, useValue: scrollServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should expose the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should expose the shared socials list', () => {
    expect(component.socials).toBe(socials);
  });

  it('should not throw on init', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should render the copyright with the current year', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(String(component.currentYear));
  });
});
