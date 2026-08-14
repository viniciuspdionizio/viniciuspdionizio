import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ScrollService } from '../../services/scroll.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let scrollServiceSpy: jasmine.SpyObj<ScrollService>;

  beforeEach(async () => {
    scrollServiceSpy = jasmine.createSpyObj('ScrollService', ['scrollToSection']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: ScrollService, useValue: scrollServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed and not scrolled', () => {
    expect(component.isMenuOpen).toBeFalse();
    expect(component.isScrolled).toBeFalse();
  });

  it('should expose the expected nav links', () => {
    expect(component.navLinks.map((l) => l.href)).toEqual(['#home', '#about', '#skills', '#experience', '#contact']);
  });

  it('should toggle the mobile menu open state', () => {
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();

    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should mark isScrolled true once the page scrolls past 20px', () => {
    const scrollYSpy = spyOnProperty(window, 'scrollY', 'get').and.returnValue(50);
    component.onWindowScroll();
    expect(component.isScrolled).toBeTrue();

    scrollYSpy.and.returnValue(0);
    component.onWindowScroll();
    expect(component.isScrolled).toBeFalse();
  });

  it('should close the mobile menu and delegate scrolling to ScrollService', () => {
    component.isMenuOpen = true;
    const event = new Event('click');

    component.scrollToSection(event, '#about');

    expect(component.isMenuOpen).toBeFalse();
    expect(scrollServiceSpy.scrollToSection).toHaveBeenCalledWith(event, '#about');
  });
});
