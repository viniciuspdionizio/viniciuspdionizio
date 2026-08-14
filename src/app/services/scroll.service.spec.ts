import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prevent the default click behavior', () => {
    const event = new Event('click');
    spyOn(event, 'preventDefault');

    service.scrollToSection(event, '#does-not-exist');

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should scroll smoothly to the target element when it exists', () => {
    const target = document.createElement('div');
    target.id = 'scroll-target-test';
    document.body.appendChild(target);
    spyOn(target, 'scrollIntoView');

    service.scrollToSection(new Event('click'), '#scroll-target-test');

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    document.body.removeChild(target);
  });

  it('should not throw when the target element does not exist', () => {
    expect(() => service.scrollToSection(new Event('click'), '#nope')).not.toThrow();
  });
});
